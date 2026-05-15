"""
Trends routes — historical data with analytics.
"""

from fastapi import APIRouter, HTTPException, Query
from app.services import frankfurter
from app.utils.analytics import (
    calculate_sma,
    calculate_ema,
    calculate_volatility,
    calculate_rsi,
    calculate_statistics,
)

router = APIRouter(prefix="/api", tags=["trends"])


@router.get("/trends")
async def get_trends(
    base: str = Query("USD", alias="from", description="Base currency"),
    quote: str = Query("INR", alias="to", description="Quote currency"),
    timeframe: str = Query("1Y", description="Timeframe: 1W, 1M, 3M, 6M, 1Y, 5Y"),
):
    """
    Get historical exchange rate data with computed analytics.
    Returns time-series data along with SMA, EMA, Volatility, RSI, and statistics.
    """
    if base == quote:
        raise HTTPException(status_code=400, detail="Base and quote currency must be different")

    valid_timeframes = {"1W", "1M", "3M", "6M", "1Y", "5Y"}
    if timeframe not in valid_timeframes:
        raise HTTPException(status_code=400, detail=f"Invalid timeframe. Must be one of: {valid_timeframes}")

    try:
        start_date, end_date = frankfurter.get_date_range(timeframe)
        data = await frankfurter.get_historical_range(base, quote, start_date, end_date)

        rates = data.get("rates", {})
        dates = sorted(rates.keys())
        values = [rates[d][quote] for d in dates]

        if not values:
            raise HTTPException(status_code=404, detail="No data available for this pair/timeframe")

        # Compute analytics
        sma_period = min(50, max(5, len(values) // 4))
        sma_values = calculate_sma(values, sma_period)
        ema_values = calculate_ema(values, sma_period)
        rsi_values = calculate_rsi(values)
        volatility = calculate_volatility(values)
        stats = calculate_statistics(values)

        return {
            "pair": f"{base}/{quote}",
            "timeframe": timeframe,
            "dates": dates,
            "rates": values,
            "indicators": {
                "sma": {"period": sma_period, "values": sma_values},
                "ema": {"period": sma_period, "values": ema_values},
                "rsi": {"period": 14, "values": rsi_values},
            },
            "volatility": round(volatility * 100, 2),
            "statistics": {k: round(v, 4) if isinstance(v, float) else v for k, v in stats.items()},
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch trends: {str(e)}")
