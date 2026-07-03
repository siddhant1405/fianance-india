import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db
from app.db.models import Asset
from app.services.cache import get_cache, set_cache
from app.services.market_data import fetch_historical_data, get_current_price

router = APIRouter(prefix="/api/assets", tags=["assets"])

@router.get("")
async def list_assets(asset_type: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    cache_key = f"assets_list_{asset_type or 'all'}"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    stmt = select(Asset)
    if asset_type:
        stmt = stmt.where(Asset.asset_type == asset_type)
        
    result = await db.execute(stmt)
    assets = result.scalars().all()
    
    asset_list = [
        {
            "symbol": a.symbol,
            "name": a.name,
            "asset_type": a.asset_type,
            "exchange": a.exchange
        } for a in assets
    ]
    
    await set_cache(cache_key, asset_list, expire=86400) # 24 hours
    return asset_list

@router.get("/{symbol}")
async def get_asset(symbol: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Asset).where(Asset.symbol == symbol.upper())
    result = await db.execute(stmt)
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    return {
        "symbol": asset.symbol,
        "name": asset.name,
        "asset_type": asset.asset_type,
        "exchange": asset.exchange
    }

@router.get("/{symbol}/price")
async def get_asset_price(symbol: str):
    cache_key = f"price_{symbol.upper()}"
    cached = await get_cache(cache_key)
    if cached:
        return cached
        
    price_data = await get_current_price(symbol.upper())
    if price_data.get("price") is None:
        raise HTTPException(status_code=404, detail="Price data not found")
        
    await set_cache(cache_key, price_data, expire=60) # 60 seconds
    return price_data

@router.get("/{symbol}/history")
async def get_asset_history(symbol: str, period: str = Query("1y"), interval: str = Query("1d")):
    cache_key = f"history_{symbol.upper()}_{period}_{interval}"
    cached = await get_cache(cache_key)
    if cached:
        return cached
        
    df = await fetch_historical_data(symbol.upper(), period, interval)
    if df.empty:
        raise HTTPException(status_code=404, detail="Historical data not found")
        
    # Convert DataFrame to list of dicts for JSON response
    history_data = df.to_dict(orient="records")
    
    await set_cache(cache_key, history_data, expire=900) # 15 minutes
    return history_data
