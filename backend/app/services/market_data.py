import logging
import yfinance as yf
import httpx
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)

# ~10% import duty + 3% GST — applied AFTER the base USD→INR conversion.
# Kept as a separate constant so it can be tuned without touching the formula.
INDIA_GOLD_PREMIUM_PCT = 13.0

# Troy ounce to grams conversion factor
TROY_OZ_TO_GRAMS = 31.1035

# Commodity symbol → gold-api.com ticker mapping
_COMMODITY_API_TICKERS = {
    "GC=F": "XAU",   # Gold
    "SI=F": "XAG",   # Silver
}


def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculates all required technical indicators for the given OHLCV DataFrame."""
    if df.empty or len(df) < 50:
        # Not enough data for robust indicators
        return df

    # SMA (50 period)
    df['SMA_50'] = df['close'].rolling(window=50).mean()
    
    # EMA (50 period)
    df['EMA_50'] = df['close'].ewm(span=50, adjust=False).mean()
    
    # RSI (14 period)
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI_14'] = 100 - (100 / (1 + rs))
    
    # MACD
    ema_12 = df['close'].ewm(span=12, adjust=False).mean()
    ema_26 = df['close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = ema_12 - ema_26
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    
    # Bollinger Bands (20 period, 2 stdev)
    sma_20 = df['close'].rolling(window=20).mean()
    std_20 = df['close'].rolling(window=20).std()
    df['BB_Upper'] = sma_20 + (std_20 * 2)
    df['BB_Lower'] = sma_20 - (std_20 * 2)
    
    # Volatility (Annualized standard deviation of daily returns)
    df['Volatility'] = df['close'].pct_change().rolling(window=50).std() * np.sqrt(252)
    
    # Momentum (10 day)
    df['Momentum'] = df['close'].pct_change(periods=10)
    
    # Fill NAs with None so they can be JSON serialized nicely if needed
    df = df.replace({np.nan: None})
    return df

async def fetch_historical_data(symbol: str, period: str = "1y", interval: str = "1d") -> pd.DataFrame:
    """Fetches historical OHLCV data using yfinance and adds technical indicators."""
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval)
    
    if df.empty:
        return pd.DataFrame()
        
    df = df.reset_index()
    # Normalize column names to lowercase
    df.columns = [c.lower() for c in df.columns]
    
    # Calculate indicators
    df = calculate_technical_indicators(df)
    return df


async def _fetch_usdinr_rate() -> float:
    """Fetch the current USD/INR exchange rate directly via yfinance.
    Returns 0.0 if unavailable."""
    try:
        ticker = yf.Ticker("USDINR=X")
        data = ticker.history(period="5d")
        if not data.empty:
            return float(data['Close'].iloc[-1])
    except Exception as e:
        logger.error("Failed to fetch USDINR rate: %s", e)
    return 0.0


async def _fetch_commodity_price_inr(symbol: str) -> dict:
    """Fetch gold/silver spot price from gold-api.com, convert to INR per 10g.

    Steps:
      1. GET https://api.gold-api.com/price/{XAU|XAG}  → USD per troy oz
      2. price_per_gram_usd  = usd_per_oz / 31.1035
      3. price_per_gram_inr  = price_per_gram_usd * usdinr_rate
      4. price_per_10g_inr   = price_per_gram_inr * 10
      5. Apply INDIA_GOLD_PREMIUM_PCT
    """
    api_ticker = _COMMODITY_API_TICKERS.get(symbol.upper())
    if not api_ticker:
        return {"price": None, "change": None, "change_percent": None}

    # --- 1. Fetch USD spot price from gold-api.com ---
    usd_price_per_oz = None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"https://api.gold-api.com/price/{api_ticker}")
            resp.raise_for_status()
            body = resp.json()
            usd_price_per_oz = float(body["price"])
            logger.info("gold-api.com %s → $%.2f/oz", api_ticker, usd_price_per_oz)
    except Exception as e:
        logger.warning("gold-api.com fetch failed for %s: %s — falling back to yfinance", api_ticker, e)

    # Fallback: use yfinance if gold-api.com is down
    if usd_price_per_oz is None:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="5d")
            if not hist.empty:
                usd_price_per_oz = float(hist['Close'].iloc[-1])
        except Exception as e:
            logger.error("yfinance fallback also failed for %s: %s", symbol, e)
            return {"price": None, "change": None, "change_percent": None}

    if usd_price_per_oz is None:
        return {"price": None, "change": None, "change_percent": None}

    # --- 2. Fetch USD/INR rate ---
    usdinr_rate = await _fetch_usdinr_rate()
    if usdinr_rate <= 0:
        logger.error("USDINR rate is zero/unavailable — cannot convert commodity price")
        return {"price": None, "change": None, "change_percent": None}

    # --- 3. Convert: USD/oz → INR/10g ---
    price_per_gram_usd = usd_price_per_oz / TROY_OZ_TO_GRAMS
    price_per_gram_inr = price_per_gram_usd * usdinr_rate
    price_per_10g_inr = price_per_gram_inr * 10

    # --- 4. Apply India premium (import duty + GST) ---
    price_per_10g_inr_with_premium = price_per_10g_inr * (1 + INDIA_GOLD_PREMIUM_PCT / 100)
    final_price = round(price_per_10g_inr_with_premium, 2)

    logger.info(
        "Commodity %s: $%.2f/oz → ₹%.2f/g → ₹%.2f/10g (%.0f%% premium → ₹%.2f/10g)",
        symbol, usd_price_per_oz, price_per_gram_inr,
        price_per_10g_inr, INDIA_GOLD_PREMIUM_PCT, final_price,
    )

    # --- 5. Day-over-day change from yfinance (best-effort) ---
    change = 0.0
    change_pct = 0.0
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5d")
        if len(hist) > 1:
            cur = float(hist['Close'].iloc[-1])
            prev = float(hist['Close'].iloc[-2])
            # Compute change relative to the *converted* price, not raw USD
            raw_change_pct = ((cur - prev) / prev) * 100
            change_pct = round(raw_change_pct, 4)
            change = round(final_price * raw_change_pct / 100, 2)
    except Exception:
        pass  # non-critical

    return {
        "price": final_price,
        "change": change,
        "change_percent": change_pct,
    }


async def get_current_price(symbol: str) -> dict:
    """Fetches current price and day change.
    
    Commodities (GC=F, SI=F) are routed through gold-api.com and served as
    INR per 10 grams (24K purity). Everything else goes through yfinance directly.
    """
    # Route commodities to the dedicated handler
    if symbol.upper() in _COMMODITY_API_TICKERS:
        return await _fetch_commodity_price_inr(symbol)

    # --- Non-commodity path (stocks, indices, forex) ---
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="5d")
    
    if data.empty:
        return {"price": None, "change": None, "change_percent": None}
        
    current = data['Close'].iloc[-1]
    if len(data) > 1:
        previous = data['Close'].iloc[-2]
        change = current - previous
        change_pct = (change / previous) * 100
    else:
        change, change_pct = 0, 0

    return {
        "price": float(current),
        "change": float(change),
        "change_percent": float(change_pct),
    }
