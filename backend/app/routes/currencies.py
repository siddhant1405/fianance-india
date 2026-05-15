"""
Currency routes — list available currencies.
"""

from fastapi import APIRouter, HTTPException
from app.services import frankfurter

router = APIRouter(prefix="/api", tags=["currencies"])


@router.get("/currencies")
async def list_currencies():
    """Return all available currencies from the Frankfurter API."""
    try:
        currencies = await frankfurter.get_currencies()
        return {"currencies": currencies}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch currencies: {str(e)}")
