from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Asset

INITIAL_ASSETS = [
    # Forex
    {"symbol": "USDINR=X", "name": "USD/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "EURINR=X", "name": "EUR/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "GBPINR=X", "name": "GBP/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "JPYINR=X", "name": "JPY/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "AEDINR=X", "name": "AED/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "SGDINR=X", "name": "SGD/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "CADINR=X", "name": "CAD/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "AUDINR=X", "name": "AUD/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "CHFINR=X", "name": "CHF/INR", "asset_type": "forex", "exchange": "CCY"},
    {"symbol": "CNYINR=X", "name": "CNY/INR", "asset_type": "forex", "exchange": "CCY"},
    # Stocks
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "INFY.NS", "name": "Infosys", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ITC.NS", "name": "ITC Limited", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SBIN.NS", "name": "State Bank of India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "LT.NS", "name": "Larsen & Toubro", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "asset_type": "stock", "exchange": "NSE"},
    # Indices
    {"symbol": "^NSEI", "name": "Nifty 50", "asset_type": "index", "exchange": "NSE"},
    {"symbol": "^BSESN", "name": "BSE Sensex", "asset_type": "index", "exchange": "BSE"},
    # Commodities
    {"symbol": "GC=F", "name": "Gold", "asset_type": "commodity", "exchange": "COMEX"},
    {"symbol": "SI=F", "name": "Silver", "asset_type": "commodity", "exchange": "COMEX"},
]

async def seed_assets(db: AsyncSession):
    stmt = select(Asset)
    result = await db.execute(stmt)
    existing_assets = result.scalars().all()
    
    if len(existing_assets) < len(INITIAL_ASSETS):
        existing_symbols = {a.symbol for a in existing_assets}
        new_assets = [
            Asset(**asset) for asset in INITIAL_ASSETS if asset["symbol"] not in existing_symbols
        ]
        
        if new_assets:
            db.add_all(new_assets)
            await db.commit()
            print(f"Seeded {len(new_assets)} assets to the database.")
    else:
        print("Assets already seeded.")
