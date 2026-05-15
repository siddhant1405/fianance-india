"""
Performance routes — global currency performance tracking.
"""

from fastapi import APIRouter, HTTPException, Query
from app.services import frankfurter

router = APIRouter(prefix="/api", tags=["performance"])

MAJOR_CURRENCIES = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "INR", "CNY", "KRW", "MXN"]


@router.get("/performance")
async def get_performance(
    base: str = Query("USD", description="Base currency to compare against"),
):
    """
    Get 7-day and 30-day performance of major currencies vs a base currency.
    Returns current rate, weekly change %, and monthly change % for each pair.
    """
    try:
        # Fetch latest rates
        latest_data = await frankfurter.get_latest_rates(base)
        latest_rates = latest_data.get("rates", {})

        # Fetch 7-day-ago rates
        start_date, _ = frankfurter.get_date_range("1W")
        try:
            week_data = await frankfurter.get_historical_rate(base, start_date)
            week_rates = week_data.get("rates", {})
        except Exception:
            week_rates = {}

        # Fetch 30-day-ago rates
        start_date_month, _ = frankfurter.get_date_range("1M")
        try:
            month_data = await frankfurter.get_historical_rate(base, start_date_month)
            month_rates = month_data.get("rates", {})
        except Exception:
            month_rates = {}

        # Build performance data
        currencies = [c for c in MAJOR_CURRENCIES if c != base]
        performance = []

        for currency in currencies:
            current_rate = latest_rates.get(currency, 0)
            if current_rate == 0:
                continue

            week_rate = week_rates.get(currency, current_rate)
            month_rate = month_rates.get(currency, current_rate)

            week_change = ((current_rate - week_rate) / week_rate * 100) if week_rate else 0
            month_change = ((current_rate - month_rate) / month_rate * 100) if month_rate else 0

            performance.append({
                "currency": currency,
                "pair": f"{base}/{currency}",
                "rate": round(current_rate, 4),
                "week_change": round(week_change, 2),
                "month_change": round(month_change, 2),
            })

        return {
            "base": base,
            "last_updated": latest_data.get("date", ""),
            "performance": performance,
        }

    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch performance: {str(e)}")
