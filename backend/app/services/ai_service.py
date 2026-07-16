import os
import logging
from groq import AsyncGroq

logger = logging.getLogger(__name__)

# Initialize client lazily
_client = None

def get_client() -> AsyncGroq:
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            logger.warning("GROQ_API_KEY is missing. AI Insights will return mock data.")
            return None
        _client = AsyncGroq(api_key=api_key)
    return _client

# ── System Prompt ────────────────────────────────────────────────────────────
ASSET_SYSTEM_PROMPT = """You are a market analyst writing short commentary for retail investors on a financial dashboard.

Rules:
- Write 80–150 words as a single flowing paragraph. No headings, no bullet points.
- Target audience: retail investors who understand stocks and basic metrics but are not technical analysis experts.
- Use indicator names (RSI, MACD, EMA, SMA, Bollinger Bands, volatility, momentum) naturally. When you mention one, show what it implies through context — never define it formally.
- Connect indicators together instead of listing each one separately.
- Base every statement strictly on the supplied data. Never invent data. If an indicator is missing, skip it silently.
- Do not predict prices. Do not recommend buying, selling, or holding.
- Avoid dramatic language: do not use words like "crucial", "massive", "strongly indicates", "highly likely", or "underlying selling pressure".
- Sound objective, analytical, and confident — like Tickertape or Yahoo Finance summaries.

Structure your response as:
1. One sentence: overall outlook.
2. Two to four sentences: supporting reasoning that weaves indicators together.
3. One sentence: risk or caution (only if warranted by the data).
4. One sentence: what the user should watch next."""

MARKET_SYSTEM_PROMPT = """You are a market analyst writing a brief daily market wrap for retail investors.

Rules:
- Write 80–150 words as a single flowing paragraph. No headings, no bullet points.
- Focus on overall market breadth, notable movers, and general sentiment based solely on the supplied data.
- Connect observations across assets instead of listing each one.
- Do not predict prices. Do not recommend buying, selling, or holding.
- Avoid dramatic language: no "crucial", "massive", "strongly indicates", "highly likely".
- Sound objective and professional — like a Tickertape or TradingView daily wrap."""


async def generate_asset_insight(symbol: str, price_data: dict, indicators: dict) -> str:
    """Generate a concise AI insight for a specific asset."""
    groq = get_client()
    if not groq:
        return f"{symbol} is showing consolidation patterns in the current trading session. Watch for a breakout above local resistance or a breakdown below support to confirm the next directional trend."

    # Build data context — only include indicators that are available
    data_lines = [f"Price: {price_data.get('price')} (Day Change: {price_data.get('change_percent'):.2f}%)"]

    if indicators.get('rsi') is not None:
        data_lines.append(f"RSI(14): {indicators['rsi']}")
    if indicators.get('macd_signal') is not None:
        data_lines.append(f"MACD Signal: {indicators['macd_signal']}")
    if indicators.get('volatility') is not None:
        data_lines.append(f"Volatility: {indicators['volatility']}")
    if indicators.get('sma_20') is not None:
        data_lines.append(f"SMA(20): {indicators['sma_20']}")
    if indicators.get('ema_20') is not None:
        data_lines.append(f"EMA(20): {indicators['ema_20']}")
    if indicators.get('bb_upper') is not None:
        data_lines.append(f"Bollinger Upper: {indicators['bb_upper']}")
    if indicators.get('bb_lower') is not None:
        data_lines.append(f"Bollinger Lower: {indicators['bb_lower']}")

    data_str = "\n".join(data_lines)

    prompt = f"""Analyse {symbol} using the data below. Follow the rules in your system prompt exactly.

{data_str}"""

    try:
        response = await groq.chat.completions.create(
            messages=[
                {"role": "system", "content": ASSET_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Failed to generate asset insight: {e}")
        return "AI analysis is currently unavailable."

async def generate_market_summary(watchlist_data: list) -> str:
    """Generate a concise cross-asset market summary based on watchlist performance."""
    groq = get_client()
    if not groq:
        return "The overall market presents a mixed picture today, with diverse performance across sectors and asset classes. Investors appear to be digesting recent macroeconomic data, leading to selective momentum rather than a broad-based rally. Key technical levels will dictate the trend as trading volumes stabilize."
        
    data_str = "\n".join([f"- {a.get('symbol')}: {a.get('price')} ({a.get('change_percent', 0):.2f}%)" for a in watchlist_data])
    
    prompt = f"""Write a daily market wrap based on the watchlist data below. Follow the rules in your system prompt exactly.

Watchlist:
{data_str}"""
    
    try:
        response = await groq.chat.completions.create(
            messages=[
                {"role": "system", "content": MARKET_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Failed to generate market summary: {e}")
        return "Market summary is currently unavailable due to an API error."
