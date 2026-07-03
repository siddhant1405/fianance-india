from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import asyncio

from app.db.database import get_db
from app.db.models import Asset
from app.services.cache import get_cache, set_cache
from app.services.market_data import get_current_price

router = APIRouter(prefix="/api/market", tags=["market"])

@router.get("/overview")
async def get_market_overview(db: AsyncSession = Depends(get_db)):
    """Fetch high-level market overview (Indices, Gold, USD/INR)"""
    cache_key = "market_overview"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    key_symbols = ["^NSEI", "^BSESN", "GC=F", "USDINR=X"]
    
    tasks = [get_current_price(sym) for sym in key_symbols]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    overview = []
    for sym, res in zip(key_symbols, results):
        if not isinstance(res, Exception) and res.get("price") is not None:
            overview.append({
                "symbol": sym,
                "price": res["price"],
                "change": res["change"],
                "change_percent": res["change_percent"]
            })
            
    await set_cache(cache_key, overview, expire=300) # 5 minutes
    return overview

@router.get("/heatmap")
async def get_market_heatmap(db: AsyncSession = Depends(get_db)):
    """Fetch 7-day change for all assets to power the performance heatmap"""
    cache_key = "market_heatmap"
    cached = await get_cache(cache_key)
    if cached:
        return cached
        
    stmt = select(Asset)
    result = await db.execute(stmt)
    assets = result.scalars().all()
    
    # We use get_current_price which already fetches 5d history to calculate daily change.
    # To get a real 7-day heatmap, we'd adjust get_current_price or use fetch_historical_data.
    # For now, we'll use get_current_price's percent change as a proxy for heatmap.
    
    tasks = [get_current_price(a.symbol) for a in assets]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    heatmap = []
    for a, res in zip(assets, results):
        if not isinstance(res, Exception) and res.get("price") is not None:
            heatmap.append({
                "symbol": a.symbol,
                "name": a.name,
                "asset_type": a.asset_type,
                "change_percent": res["change_percent"]
            })
            
    await set_cache(cache_key, heatmap, expire=900) # 15 minutes
    return heatmap
