"""
Currency Hub backend application entry point.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, assets, market, watchlist, conversion, currencies, performance, reports, trends, ai_routes

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Finance India API",
    description="Backend API for Finance India — AI-powered multi-asset Indian financial intelligence platform. Provides real-time conversion, historical trends with statistical indicators, global currency performance tracking, and daily watchlist PDF reports.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Allow local development origins by default and extend them in production
# via the CORS_ALLOW_ORIGINS environment variable.
cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

extra_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[*cors_origins, *extra_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(assets.router)
app.include_router(market.router)
app.include_router(watchlist.router)
app.include_router(currencies.router)
app.include_router(conversion.router)
app.include_router(trends.router)
app.include_router(performance.router)
app.include_router(reports.router)
app.include_router(ai_routes.router)


# ── Lifecycle Events ──────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    """Initialize background services and DB on application startup."""
    from app.services.report_scheduler import start_scheduler, schedule_price_ingestion
    from app.db.database import engine, Base, async_session
    import app.db.models # Ensure models are loaded
    from app.db.seed import seed_assets
    import asyncio
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with async_session() as db:
        await seed_assets(db)
        
    start_scheduler()
    
    # Load and schedule user reports
    async def init_report_schedules():
        from app.db.models import ReportPreference
        from sqlalchemy.future import select
        from app.routes.reports import execute_scheduled_report
        from datetime import time as dt_time
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            async with async_session() as session:
                stmt = select(ReportPreference).where(ReportPreference.is_enabled == True)
                result = await session.execute(stmt)
                prefs = result.scalars().all()
                
            for pref in prefs:
                try:
                    delivery_time = dt_time.fromisoformat(pref.delivery_time)
                    from app.services.report_scheduler import schedule_user_report
                    schedule_user_report(pref.user_id, delivery_time, execute_scheduled_report)
                except Exception as e:
                    logger.error(f"Failed to schedule report for user {pref.user_id}: {e}")
            logger.info(f"Loaded {len(prefs)} report schedules on startup.")
        except Exception as e:
            logger.error(f"Error loading report schedules: {e}")
            
    await init_report_schedules()
    
    # Define price ingestion job
    async def price_ingestion_job():
        from app.services.market_data import get_current_price
        from sqlalchemy.future import select
        from app.db.models import Asset
        import logging
        logger = logging.getLogger(__name__)
        logger.info("Starting price ingestion job...")
        
        try:
            async with async_session() as session:
                result = await session.execute(select(Asset))
                all_assets = result.scalars().all()
                
            tasks = [get_current_price(a.symbol) for a in all_assets]
            await asyncio.gather(*tasks, return_exceptions=True)
            logger.info("Completed price ingestion job.")
        except Exception as e:
            logger.error(f"Error in price ingestion job: {e}")
            
    schedule_price_ingestion(price_ingestion_job)

@app.on_event("shutdown")
async def shutdown_event():
    """Gracefully shut down background services."""
    from app.services.report_scheduler import shutdown_scheduler
    shutdown_scheduler()


@app.get("/", tags=["health"])
async def root():
    return {
        "service": "Finance India API",
        "version": "2.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
