"""
ExchangeRate API service.
Handles communication with the ExchangeRate API for real-time conversion.
"""

import httpx
import os
from typing import Optional

BASE_URL = "https://v6.exchangerate-api.com/v6"


def get_api_key() -> str:
    """Get the ExchangeRate API key from environment variables."""
    key = os.getenv("EXCHANGE_API_KEY", "")
    if not key:
        raise ValueError("EXCHANGE_API_KEY not set in environment variables")
    return key


async def get_latest_rates(base_currency: str) -> dict:
    """Fetch latest exchange rates from ExchangeRate API."""
    api_key = get_api_key()
    async with httpx.AsyncClient() as client:
        url = f"{BASE_URL}/{api_key}/latest/{base_currency}"
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        if data.get("result") != "success":
            raise ValueError(data.get("error-type", "Unknown API error"))

        return data


async def convert_currency(
    from_currency: str, to_currency: str, amount: float
) -> dict:
    """Convert a specific amount between two currencies."""
    data = await get_latest_rates(from_currency)
    rates = data.get("conversion_rates", {})

    if to_currency not in rates:
        raise ValueError(f"Currency {to_currency} not found in rates")

    rate = rates[to_currency]
    converted = rate * amount

    return {
        "from": from_currency,
        "to": to_currency,
        "amount": amount,
        "rate": rate,
        "converted_amount": round(converted, 4),
        "last_updated": data.get("time_last_update_utc", ""),
    }
