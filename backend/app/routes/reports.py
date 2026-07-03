import logging
from datetime import datetime, time as dt_time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import Response
from pydantic import BaseModel, Field, validator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db, async_session
from app.db.models import User, ReportPreference, WatchlistItem, Asset
from app.services.auth import get_current_user
from app.services.pdf_generator import generate_watchlist_report
from app.services.email_service import send_report_email
from app.services.ai_service import generate_market_summary
from app.services.report_scheduler import (
    schedule_user_report,
    unschedule_user_report,
    get_user_job_info,
)
from app.services.market_data import get_current_price, fetch_historical_data

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/reports", tags=["reports"])

class ReportPreferencesUpdate(BaseModel):
    is_enabled: Optional[bool] = None
    delivery_time: Optional[str] = Field(
        None,
        description="Delivery time in HH:MM format (IST), e.g. '08:00'",
        pattern=r"^\d{2}:\d{2}$",
    )

    @validator("delivery_time")
    def validate_delivery_time(cls, v):
        if v is None:
            return v
        try:
            parsed = dt_time.fromisoformat(v)
        except ValueError:
            raise ValueError("delivery_time must be in HH:MM format")
        if parsed.hour < 6 or parsed.hour > 21:
            raise ValueError("delivery_time must be between 06:00 and 22:00")
        if parsed.minute not in (0, 30):
            raise ValueError("delivery_time must be in 30-minute increments (e.g. 08:00, 08:30)")
        return v

class ReportPreferencesResponse(BaseModel):
    is_enabled: bool
    delivery_time: str
    timezone: str
    last_sent_at: Optional[str]
    next_scheduled: Optional[str]

async def _get_or_create_prefs(user_id: int, db: AsyncSession) -> ReportPreference:
    stmt = select(ReportPreference).where(ReportPreference.user_id == user_id)
    result = await db.execute(stmt)
    pref = result.scalar_one_or_none()
    
    if not pref:
        pref = ReportPreference(user_id=user_id, is_enabled=False, delivery_time="08:00")
        db.add(pref)
        await db.commit()
        await db.refresh(pref)
    return pref

async def _generate_report_for_user(user: User, db: AsyncSession) -> bytes:
    stmt = select(WatchlistItem).where(WatchlistItem.user_id == user.id)
    result = await db.execute(stmt)
    items = result.scalars().all()
    
    watchlist_assets = []
    indicators_map = {}
    sparkline_map = {}
    
    for item in items:
        symbol = item.asset_symbol
        
        price_data = await get_current_price(symbol)
        df = await fetch_historical_data(symbol, period="1mo", interval="1d")
        
        stmt_asset = select(Asset).where(Asset.symbol == symbol)
        asset_res = await db.execute(stmt_asset)
        asset_obj = asset_res.scalar_one_or_none()
        name = asset_obj.name if asset_obj else symbol
        a_type = asset_obj.asset_type if asset_obj else "unknown"
        
        watchlist_assets.append({
            "symbol": symbol,
            "name": name,
            "asset_type": a_type,
            "price": price_data.get("price") or 0,
            "change": price_data.get("change") or 0,
            "change_percent": price_data.get("change_percent") or 0,
        })
        
        if not df.empty:
            latest = df.iloc[-1]
            macd = latest.get("MACD", 0)
            macd_sig = latest.get("MACD_Signal", 0)
            macd_signal_text = "Bullish" if macd > macd_sig else "Bearish"
            
            price = latest.get("close", 0)
            bb_high = latest.get("BB_Upper", 0)
            bb_low = latest.get("BB_Lower", 0)
            bb_mid = latest.get("SMA_50", 0) # SMA 20 is typically mid, but we only have SMA 50 or we can compute it
            
            if price > bb_high:
                bb_pos = "Above upper band"
            elif price < bb_low:
                bb_pos = "Below lower band"
            elif price > bb_mid:
                bb_pos = "Upper half"
            else:
                bb_pos = "Lower half"
                
            indicators_map[symbol] = {
                "rsi": latest.get("RSI_14"),
                "sma": latest.get("SMA_50"),
                "ema": latest.get("EMA_50"),
                "volatility": latest.get("Volatility_14"),
                "macd_signal": macd_signal_text,
                "bollinger_position": bb_pos,
            }
            
            last_7 = df.tail(7)
            
            if "date" in last_7.columns:
                dates = last_7["date"].dt.strftime("%Y-%m-%d").tolist()
            elif "datetime" in last_7.columns:
                dates = last_7["datetime"].dt.strftime("%Y-%m-%d").tolist()
            else:
                dates = [datetime.now().strftime("%Y-%m-%d")] * len(last_7)
            
            sparkline_map[symbol] = {
                "dates": dates,
                "values": last_7["close"].tolist(),
            }
            
    # Generate AI Market Summary based on the fetched watchlist data
    ai_summary = await generate_market_summary(watchlist_assets)
            
    return generate_watchlist_report(
        user_name=user.name,
        user_email=user.email,
        watchlist_assets=watchlist_assets,
        indicators_map=indicators_map,
        sparkline_map=sparkline_map,
        ai_summary=ai_summary,
    )

async def execute_scheduled_report(user_id: int) -> None:
    logger.info("Executing scheduled report for user %d", user_id)
    try:
        async with async_session() as db:
            stmt = select(User).where(User.id == user_id)
            result = await db.execute(stmt)
            user = result.scalar_one_or_none()
            if not user:
                return
                
            pdf_bytes = await _generate_report_for_user(user, db)
            
            success = await send_report_email(
                to_email=user.email,
                user_name=user.name,
                pdf_bytes=pdf_bytes,
            )
            
            if success:
                pref = await _get_or_create_prefs(user.id, db)
                pref.last_sent_at = datetime.now()
                await db.commit()
                logger.info("Report delivered for user %d", user_id)
            else:
                logger.error("Report email failed for user %d", user_id)
    except Exception:
        logger.error("Report generation failed for user %d", user_id, exc_info=True)


@router.get("/preferences", response_model=ReportPreferencesResponse)
async def get_report_preferences(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    pref = await _get_or_create_prefs(user.id, db)
    job_info = get_user_job_info(user.id)

    return ReportPreferencesResponse(
        is_enabled=pref.is_enabled,
        delivery_time=pref.delivery_time,
        timezone="Asia/Kolkata",
        last_sent_at=pref.last_sent_at.isoformat() if pref.last_sent_at else None,
        next_scheduled=job_info["next_run_time"] if job_info else None,
    )


@router.put("/preferences", response_model=ReportPreferencesResponse)
async def update_report_preferences(
    body: ReportPreferencesUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    pref = await _get_or_create_prefs(user.id, db)

    if body.is_enabled is not None:
        pref.is_enabled = body.is_enabled
    if body.delivery_time is not None:
        pref.delivery_time = body.delivery_time
        
    await db.commit()
    await db.refresh(pref)

    if pref.is_enabled:
        delivery = dt_time.fromisoformat(pref.delivery_time)
        schedule_user_report(
            user_id=user.id,
            delivery_time=delivery,
            job_func=execute_scheduled_report,
        )
    else:
        unschedule_user_report(user.id)

    job_info = get_user_job_info(user.id)

    return ReportPreferencesResponse(
        is_enabled=pref.is_enabled,
        delivery_time=pref.delivery_time,
        timezone="Asia/Kolkata",
        last_sent_at=pref.last_sent_at.isoformat() if pref.last_sent_at else None,
        next_scheduled=job_info["next_run_time"] if job_info else None,
    )


@router.post("/preview")
async def preview_report(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        pdf_bytes = await _generate_report_for_user(user, db)
    except Exception as e:
        logger.error("Report preview failed for user %d: %s", user.id, e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate report preview")

    filename = f"FinanceIndia_Report_{datetime.now().strftime('%Y-%m-%d')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Content-Type-Options": "nosniff",
        },
    )


@router.post("/send-now")
async def send_report_now(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        pdf_bytes = await _generate_report_for_user(user, db)
    except Exception as e:
        logger.error("Report generation failed for user %d: %s", user.id, e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate report")

    success = await send_report_email(
        to_email=user.email,
        user_name=user.name,
        pdf_bytes=pdf_bytes,
    )

    if success:
        pref = await _get_or_create_prefs(user.id, db)
        pref.last_sent_at = datetime.now()
        await db.commit()
        return {"status": "sent", "message": f"Report emailed to {user.email}"}
    else:
        raise HTTPException(
            status_code=502,
            detail="Failed to send report email. Check SMTP configuration.",
        )
