"""
Conversion routes — real-time currency conversion.
"""

from fastapi import APIRouter, HTTPException, Query
from app.services import exchangerate

router = APIRouter(prefix="/api", tags=["conversion"])


@router.get("/convert")
async def convert(
    from_currency: str = Query(..., alias="from", description="Source currency code (e.g., USD)"),
    to_currency: str = Query(..., alias="to", description="Target currency code (e.g., INR)"),
    amount: float = Query(1.0, description="Amount to convert"),
):
    """
    Convert an amount from one currency to another.
    Uses the ExchangeRate API for real-time conversion rates.
    """
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    try:
        result = await exchangerate.convert_currency(from_currency, to_currency, amount)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Conversion failed: {str(e)}")
