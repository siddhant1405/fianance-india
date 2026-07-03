import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db
from app.db.models import User, WatchlistItem, Asset
from app.services.auth import get_current_user
from app.services.market_data import get_current_price

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

class WatchlistAdd(BaseModel):
    asset_symbol: str

@router.get("")
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(WatchlistItem).where(WatchlistItem.user_id == current_user.id)
    result = await db.execute(stmt)
    items = result.scalars().all()
    
    if not items:
        return []
        
    # Fetch live prices for watchlist items
    tasks = [get_current_price(item.asset_symbol) for item in items]
    prices = await asyncio.gather(*tasks, return_exceptions=True)
    
    watchlist_data = []
    for item, price_data in zip(items, prices):
        if isinstance(price_data, Exception) or price_data.get("price") is None:
            price_data = {"price": None, "change": None, "change_percent": None}
            
        watchlist_data.append({
            "id": item.id,
            "asset_symbol": item.asset_symbol,
            **price_data
        })
        
    return watchlist_data

@router.post("")
async def add_to_watchlist(
    data: WatchlistAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify asset exists
    asset_stmt = select(Asset).where(Asset.symbol == data.asset_symbol.upper())
    asset_res = await db.execute(asset_stmt)
    if not asset_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Asset not found")
        
    # Check if already in watchlist
    check_stmt = select(WatchlistItem).where(
        WatchlistItem.user_id == current_user.id,
        WatchlistItem.asset_symbol == data.asset_symbol.upper()
    )
    check_res = await db.execute(check_stmt)
    if check_res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Asset already in watchlist")
        
    new_item = WatchlistItem(user_id=current_user.id, asset_symbol=data.asset_symbol.upper())
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    
    return {"id": new_item.id, "asset_symbol": new_item.asset_symbol}

@router.delete("/{symbol}")
async def remove_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(WatchlistItem).where(
        WatchlistItem.user_id == current_user.id,
        WatchlistItem.asset_symbol == symbol.upper()
    )
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in watchlist")
        
    await db.delete(item)
    await db.commit()
    return {"status": "success", "message": "Removed from watchlist"}
