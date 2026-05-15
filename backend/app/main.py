"""
Currency Hub — FastAPI Backend
Main application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import currencies, conversion, trends, performance

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Currency Hub API",
    description="Backend API for the Currency Hub forex analytics dashboard. Provides real-time conversion, historical trends with statistical indicators, and global currency performance tracking.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # React dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(currencies.router)
app.include_router(conversion.router)
app.include_router(trends.router)
app.include_router(performance.router)


@app.get("/", tags=["health"])
async def root():
    return {
        "service": "Currency Hub API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
