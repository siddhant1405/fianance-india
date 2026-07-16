from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Asset

INITIAL_ASSETS = [
    # ── Forex ────────────────────────────────────────────────────────────────
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

    # ── Nifty 100 Stocks (Yahoo Finance .NS tickers) ────────────────────────
    # Nifty 50
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "INFY.NS", "name": "Infosys", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SBIN.NS", "name": "State Bank of India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ITC.NS", "name": "ITC Limited", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "LT.NS", "name": "Larsen & Toubro", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "AXISBANK.NS", "name": "Axis Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SUNPHARMA.NS", "name": "Sun Pharma", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TITAN.NS", "name": "Titan Company", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ASIANPAINT.NS", "name": "Asian Paints", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ADANIENT.NS", "name": "Adani Enterprises", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ADANIPORTS.NS", "name": "Adani Ports & SEZ", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BAJAJFINSV.NS", "name": "Bajaj Finserv", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "WIPRO.NS", "name": "Wipro", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HCLTECH.NS", "name": "HCL Technologies", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "NTPC.NS", "name": "NTPC", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "POWERGRID.NS", "name": "Power Grid Corporation", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TATASTEEL.NS", "name": "Tata Steel", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ONGC.NS", "name": "ONGC", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "JSWSTEEL.NS", "name": "JSW Steel", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "M&M.NS", "name": "Mahindra & Mahindra", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "COALINDIA.NS", "name": "Coal India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TECHM.NS", "name": "Tech Mahindra", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HDFCLIFE.NS", "name": "HDFC Life Insurance", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SBILIFE.NS", "name": "SBI Life Insurance", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "GRASIM.NS", "name": "Grasim Industries", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "NESTLEIND.NS", "name": "Nestle India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BPCL.NS", "name": "Bharat Petroleum", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "DIVISLAB.NS", "name": "Divi's Laboratories", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "CIPLA.NS", "name": "Cipla", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "DRREDDY.NS", "name": "Dr. Reddy's Laboratories", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BRITANNIA.NS", "name": "Britannia Industries", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "EICHERMOT.NS", "name": "Eicher Motors", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "APOLLOHOSP.NS", "name": "Apollo Hospitals", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "INDUSINDBK.NS", "name": "IndusInd Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HEROMOTOCO.NS", "name": "Hero MotoCorp", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TATACONSUM.NS", "name": "Tata Consumer Products", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BAJAJ-AUTO.NS", "name": "Bajaj Auto", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HINDALCO.NS", "name": "Hindalco Industries", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ADANIGREEN.NS", "name": "Adani Green Energy", "asset_type": "stock", "exchange": "NSE"},

    # Nifty Next 50
    {"symbol": "SHRIRAMFIN.NS", "name": "Shriram Finance", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HAVELLS.NS", "name": "Havells India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "PIDILITIND.NS", "name": "Pidilite Industries", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "DLF.NS", "name": "DLF", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BANKBARODA.NS", "name": "Bank of Baroda", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SIEMENS.NS", "name": "Siemens India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "IOC.NS", "name": "Indian Oil Corporation", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "GODREJCP.NS", "name": "Godrej Consumer Products", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "DABUR.NS", "name": "Dabur India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "AMBUJACEM.NS", "name": "Ambuja Cements", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ABB.NS", "name": "ABB India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "INDIGO.NS", "name": "InterGlobe Aviation (IndiGo)", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "VEDL.NS", "name": "Vedanta", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TRENT.NS", "name": "Trent", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ICICIPRULI.NS", "name": "ICICI Prudential Life", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "JINDALSTEL.NS", "name": "Jindal Steel & Power", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "HAL.NS", "name": "Hindustan Aeronautics", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BERGEPAINT.NS", "name": "Berger Paints", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "LICI.NS", "name": "Life Insurance Corporation", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "PNB.NS", "name": "Punjab National Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "MARICO.NS", "name": "Marico", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SAIL.NS", "name": "Steel Authority of India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TORNTPHARM.NS", "name": "Torrent Pharmaceuticals", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "SRF.NS", "name": "SRF", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "COLPAL.NS", "name": "Colgate-Palmolive India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "MCDOWELL-N.NS", "name": "United Spirits", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "CANBK.NS", "name": "Canara Bank", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "PFC.NS", "name": "Power Finance Corporation", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "RECLTD.NS", "name": "REC Limited", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "GAIL.NS", "name": "GAIL India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "NAUKRI.NS", "name": "Info Edge (Naukri)", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ZOMATO.NS", "name": "Zomato", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "IRCTC.NS", "name": "IRCTC", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "MAXHEALTH.NS", "name": "Max Healthcare", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "MUTHOOTFIN.NS", "name": "Muthoot Finance", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "POLYCAB.NS", "name": "Polycab India", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "TVSMOTOR.NS", "name": "TVS Motor Company", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "CHOLAFIN.NS", "name": "Cholamandalam Finance", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "BEL.NS", "name": "Bharat Electronics", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "JIOFIN.NS", "name": "Jio Financial Services", "asset_type": "stock", "exchange": "NSE"},
    {"symbol": "ATGL.NS", "name": "Adani Total Gas", "asset_type": "stock", "exchange": "NSE"},

    # ── Indices ──────────────────────────────────────────────────────────────
    {"symbol": "^NSEI", "name": "Nifty 50", "asset_type": "index", "exchange": "NSE"},
    {"symbol": "^BSESN", "name": "BSE Sensex", "asset_type": "index", "exchange": "BSE"},

    # ── Commodities ──────────────────────────────────────────────────────────
    {"symbol": "GC=F", "name": "Gold", "asset_type": "commodity", "exchange": "COMEX"},
    {"symbol": "SI=F", "name": "Silver", "asset_type": "commodity", "exchange": "COMEX"},
]

async def seed_assets(db: AsyncSession):
    stmt = select(Asset)
    result = await db.execute(stmt)
    existing_assets = result.scalars().all()
    
    existing_symbols = {a.symbol for a in existing_assets}
    new_assets = [
        Asset(**asset) for asset in INITIAL_ASSETS if asset["symbol"] not in existing_symbols
    ]
    
    if new_assets:
        db.add_all(new_assets)
        await db.commit()
        print(f"Seeded {len(new_assets)} new assets to the database.")
    else:
        print("All assets already seeded.")
