"""
Analytics utility functions for forex data analysis.
Implements SMA, EMA, Volatility, RSI, and other statistical indicators.
"""

import math
from typing import List, Optional


def calculate_sma(data: List[float], period: int) -> List[Optional[float]]:
    """
    Calculate Simple Moving Average.
    Returns a list of the same length as input, with None for positions
    where the SMA cannot be calculated (not enough preceding data).
    """
    if len(data) < period or period <= 0:
        return [None] * len(data)

    result = [None] * (period - 1)
    for i in range(period - 1, len(data)):
        window = data[i - period + 1 : i + 1]
        result.append(sum(window) / period)
    return result


def calculate_ema(data: List[float], period: int) -> List[Optional[float]]:
    """
    Calculate Exponential Moving Average.
    """
    if len(data) < period or period <= 0:
        return [None] * len(data)

    multiplier = 2 / (period + 1)
    ema = [None] * (period - 1)

    # First EMA value is the SMA of the first `period` values
    first_sma = sum(data[:period]) / period
    ema.append(first_sma)

    for i in range(period, len(data)):
        val = (data[i] - ema[-1]) * multiplier + ema[-1]
        ema.append(val)

    return ema


def calculate_volatility(data: List[float]) -> float:
    """
    Calculate annualized volatility based on daily log returns.
    Returns a decimal (e.g., 0.15 = 15% annualized volatility).
    """
    if len(data) < 2:
        return 0.0

    # Calculate daily returns
    returns = []
    for i in range(1, len(data)):
        if data[i - 1] != 0:
            returns.append((data[i] - data[i - 1]) / data[i - 1])

    if not returns:
        return 0.0

    # Standard deviation of returns
    mean = sum(returns) / len(returns)
    variance = sum((r - mean) ** 2 for r in returns) / len(returns)
    std_dev = math.sqrt(variance)

    # Annualize (assume 252 trading days)
    return std_dev * math.sqrt(252)


def calculate_rsi(data: List[float], period: int = 14) -> List[Optional[float]]:
    """
    Calculate Relative Strength Index.
    """
    if len(data) < period + 1:
        return [None] * len(data)

    result = [None] * period

    # Calculate price changes
    changes = [data[i] - data[i - 1] for i in range(1, len(data))]

    # First average gain/loss
    gains = [max(c, 0) for c in changes[:period]]
    losses = [abs(min(c, 0)) for c in changes[:period]]

    avg_gain = sum(gains) / period
    avg_loss = sum(losses) / period

    if avg_loss == 0:
        result.append(100.0)
    else:
        rs = avg_gain / avg_loss
        result.append(100 - (100 / (1 + rs)))

    # Subsequent values using smoothed averages
    for i in range(period, len(changes)):
        change = changes[i]
        gain = max(change, 0)
        loss = abs(min(change, 0))

        avg_gain = (avg_gain * (period - 1) + gain) / period
        avg_loss = (avg_loss * (period - 1) + loss) / period

        if avg_loss == 0:
            result.append(100.0)
        else:
            rs = avg_gain / avg_loss
            result.append(100 - (100 / (1 + rs)))

    return result


def calculate_statistics(data: List[float]) -> dict:
    """
    Calculate comprehensive statistics for a dataset.
    """
    if not data:
        return {}

    sorted_data = sorted(data)
    n = len(data)

    return {
        "high": max(data),
        "low": min(data),
        "average": sum(data) / n,
        "median": sorted_data[n // 2] if n % 2 else (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2,
        "std_dev": math.sqrt(sum((x - sum(data) / n) ** 2 for x in data) / n) if n > 0 else 0,
        "range": max(data) - min(data),
        "first": data[0],
        "last": data[-1],
        "change": data[-1] - data[0],
        "change_percent": ((data[-1] - data[0]) / data[0] * 100) if data[0] != 0 else 0,
        "data_points": n,
    }
