"""
Frankfurter API service.
Handles all communication with the Frankfurter exchange rate API.
"""

import httpx
from datetime import date, timedelta
from typing import Dict, List, Optional

BASE_URL = "https://api.frankfurter.dev/v1"


async def get_currencies() -> Dict[str, str]:
    """Fetch all available currencies."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/currencies")
        response.raise_for_status()
        return response.json()


async def get_latest_rates(base: str) -> dict:
    """Fetch latest exchange rates for a base currency."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/latest", params={"from": base})
        response.raise_for_status()
        return response.json()


async def get_historical_rate(base: str, date_str: str) -> dict:
    """Fetch exchange rates for a specific date."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/{date_str}", params={"from": base})
        response.raise_for_status()
        return response.json()


async def get_historical_range(
    base: str, quote: str, start_date: str, end_date: str
) -> dict:
    """Fetch historical exchange rates for a date range."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        url = f"{BASE_URL}/{start_date}..{end_date}"
        response = await client.get(url, params={"from": base, "to": quote})
        response.raise_for_status()
        return response.json()


def get_date_range(timeframe: str) -> tuple[str, str]:
    """Convert a timeframe string to start and end date strings."""
    end = date.today()
    
    timeframe_map = {
        "1W": timedelta(weeks=1),
        "1M": timedelta(days=30),
        "3M": timedelta(days=90),
        "6M": timedelta(days=180),
        "1Y": timedelta(days=365),
        "5Y": timedelta(days=365 * 5),
    }
    
    delta = timeframe_map.get(timeframe, timedelta(days=365))
    start = end - delta
    
    return start.isoformat(), end.isoformat()
