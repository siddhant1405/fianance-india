from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db
from app.db.models import User, WatchlistItem, Asset
from app.services.auth import get_current_user
from app.services.market_data import get_current_price, fetch_historical_data
from app.services.ai_service import generate_asset_insight, generate_market_summary

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.get("/insight/{symbol}")
async def get_insight(symbol: str, db: AsyncSession = Depends(get_db)):
    """Fetch AI insight for a specific asset."""
    # Verify asset exists
    stmt = select(Asset).where(Asset.symbol == symbol.upper())
    res = await db.execute(stmt)
    if not res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Asset not found")
        
    price_data = await get_current_price(symbol.upper())
    df = await fetch_historical_data(symbol.upper(), period="1mo", interval="1d")
    
    indicators = {}
    if not df.empty:
        latest = df.iloc[-1]
        macd = latest.get("MACD", 0)
        macd_sig = latest.get("MACD_Signal", 0)
        macd_signal_text = "Bullish" if macd > macd_sig else "Bearish"
        
        indicators = {
            "rsi": f"{latest.get('RSI_14', 0):.1f}" if latest.get('RSI_14') else "N/A",
            "macd_signal": macd_signal_text,
            "volatility": f"{latest.get('Volatility', 0):.1f}%" if latest.get('Volatility') else "N/A"
        }
        
    insight = await generate_asset_insight(symbol.upper(), price_data, indicators)
    return {"symbol": symbol.upper(), "insight": insight}

@router.get("/market-summary")
async def get_market_summary(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate AI cross-asset market summary based on user's watchlist."""
    stmt = select(WatchlistItem).where(WatchlistItem.user_id == user.id)
    result = await db.execute(stmt)
    items = result.scalars().all()
    
    if not items:
        return {"summary": "Your watchlist is empty. Add some assets to get a personalized market summary."}
        
    watchlist_data = []
    for item in items:
        price_data = await get_current_price(item.asset_symbol)
        watchlist_data.append({
            "symbol": item.asset_symbol,
            "price": price_data.get("price", 0),
            "change_percent": price_data.get("change_percent", 0)
        })
        
    summary = await generate_market_summary(watchlist_data)
    return {"summary": summary}
