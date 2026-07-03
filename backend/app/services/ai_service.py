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

async def generate_asset_insight(symbol: str, price_data: dict, indicators: dict) -> str:
    """Generate a punchy, 2-3 sentence AI insight for a specific asset."""
    groq = get_client()
    if not groq:
        return f"{symbol} is showing consolidation patterns in the current trading session. Watch for a breakout above local resistance or a breakdown below support to confirm the next directional trend."
        
    prompt = f"""
You are an expert financial analyst. Give a punchy, 2-3 sentence technical analysis insight for {symbol} based on the following real-time data:
- Price: {price_data.get('price')} (Day Change: {price_data.get('change_percent'):.2f}%)
- RSI(14): {indicators.get('rsi')}
- MACD Signal: {indicators.get('macd_signal')}
- Volatility: {indicators.get('volatility')}

Do not provide financial advice. Focus purely on price action, momentum, and key indicator readings.
    """
    
    try:
        response = await groq.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an elite quantitative analyst."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Failed to generate asset insight: {e}")
        return "AI analysis is currently unavailable."

async def generate_market_summary(watchlist_data: list) -> str:
    """Generate a 3-sentence cross-asset market summary based on watchlist performance."""
    groq = get_client()
    if not groq:
        return "The overall market presents a mixed picture today, with diverse performance across sectors and asset classes. Investors appear to be digesting recent macroeconomic data, leading to selective momentum rather than a broad-based rally. Key technical levels will dictate the trend as trading volumes stabilize."
        
    data_str = "\n".join([f"- {a.get('symbol')}: {a.get('price')} ({a.get('change_percent', 0):.2f}%)" for a in watchlist_data])
    
    prompt = f"""
You are an expert market strategist writing the executive summary for a daily financial report.
Based on the following performance of the user's watchlist today, provide a cohesive, professional 3-sentence summary of the market sentiment.

Watchlist Data:
{data_str}

Avoid fluff. Focus on overall market breadth, standout performers or laggards, and general sentiment based solely on this data. Do not provide financial advice.
    """
    
    try:
        response = await groq.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a professional market strategist."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Failed to generate market summary: {e}")
        return "Market summary is currently unavailable due to an API error."
