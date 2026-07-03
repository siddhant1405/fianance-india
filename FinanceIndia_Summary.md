# Finance India — AI-Powered Multi-Asset Indian Financial Intelligence Platform

---

## Project Summary

Finance India is a full-stack financial analytics platform that provides real-time market intelligence across multiple asset classes relevant to the Indian market. Built with React and FastAPI, it combines technical indicator computation, scheduled PDF report delivery, and AI-generated insights powered by Groq (Llama 3.3 70B).

The platform evolves from an existing currency converter dashboard into a comprehensive financial intelligence tool covering forex, Indian equities, market indices, and commodities — with PostgreSQL persistence, Redis caching, JWT authentication, and scheduled daily watchlist reports via email.

---

## Asset Universe

| Category | Assets Covered | Data Source |
|---|---|---|
| **Forex (INR Pairs)** | USD/INR, EUR/INR, GBP/INR, JPY/INR, AED/INR, SGD/INR, CAD/INR, AUD/INR, CHF/INR, CNY/INR | Frankfurter API + yfinance |
| **Indian Stocks** | Reliance, TCS, Infosys, HDFC Bank, ICICI Bank, ITC, Bharti Airtel, SBI, L&T, Hindustan Unilever | yfinance (NSE) |
| **Market Indices** | Nifty 50, Sensex | yfinance |
| **Commodities** | Gold, Silver | yfinance |

**Total: 24 tradeable instruments across 4 asset classes**

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Chart.js, Tailwind CSS, Framer Motion |
| **Backend** | FastAPI, Python, APScheduler, Pydantic |
| **Database** | PostgreSQL (persistent storage) |
| **Cache** | Redis (hot data, rate limiting) |
| **Authentication** | JWT (access + refresh tokens), bcrypt password hashing |
| **AI Engine** | Groq Cloud (Llama 3.3 70B) with grounded prompt injection |
| **Data Sources** | Frankfurter API, Yahoo Finance (yfinance), ExchangeRate API |
| **PDF Generation** | ReportLab (PDF), Matplotlib (sparkline charts) |
| **Email Delivery** | Gmail SMTP (aiosmtplib) |
| **Infrastructure** | Docker Compose, Render (backend), Netlify (frontend) |

---

## Core Features

### 1. Multi-Asset Market Dashboard
- Unified dashboard displaying real-time data across forex, stocks, indices, and commodities
- Market overview with top movers, gainers/losers, and index tickers
- Asset-type filtering and search across all 24 instruments
- Performance heatmap showing 7-day change across all assets

### 2. Technical Indicator Engine
All indicators are computed server-side and work identically across every asset class:

| Indicator | Description |
|---|---|
| **SMA** (Simple Moving Average) | Average price over N periods — identifies trend direction |
| **EMA** (Exponential Moving Average) | Weighted average favoring recent data — faster trend detection |
| **RSI** (Relative Strength Index) | Momentum oscillator (0–100) — detects overbought/oversold conditions |
| **MACD** (Moving Average Convergence Divergence) | Trend momentum via EMA crossovers — identifies bullish/bearish signals |
| **Bollinger Bands** | Price channel (SMA ± 2σ) — detects volatility and unusual price action |
| **Volatility** | Annualized standard deviation of returns — measures price stability |
| **Momentum** | Price change over N periods — measures speed of price movement |

### 3. Interactive Charting
- Multi-timeframe analysis: 1 Week, 1 Month, 3 Months, 6 Months, 1 Year, 5 Years
- Toggleable indicator overlays (SMA, EMA, MACD, Bollinger Bands, RSI)
- High/Low/Average statistics per timeframe
- Data export in CSV and JSON formats

### 4. AI-Powered Market Insights (Groq LLM)
- **Single-Asset Analysis**: AI commentary grounded in live computed metrics for any instrument
- **Cross-Asset Market Summary**: Correlation analysis across forex, stocks, indices, and commodities
- **Grounded Prompts**: Dynamically injects real computed indicators (RSI values, volatility %, MACD signals) into structured prompts — prevents generic/hallucinated responses
- **Caching**: AI responses cached in Redis (30-minute TTL) to minimize API calls

**Example Grounded Prompt:**
```
Asset: RELIANCE.NS (Reliance Industries)
Current Price: ₹2,840  |  7D Change: +2.1%
RSI(14): 72  |  Volatility: 18.3%  |  SMA(50): ₹2,780
MACD: Bullish crossover  |  Bollinger: Near upper band

Provide concise technical analysis (3-4 sentences).
Focus on what indicators suggest. Do NOT give trading advice.
```

### 5. JWT Authentication & User Accounts
- User registration and login with email/password
- bcrypt password hashing with unique salts
- JWT access tokens (30-minute expiry) + refresh tokens (7-day expiry)
- Protected routes for personalized features

### 6. Personalized Watchlists
- Add/remove any asset from a personal watchlist
- Watchlist view with live prices and change percentages
- Mix assets across categories (e.g., USD/INR + Reliance + Gold in one view)

### 7. Daily Watchlist PDF Report
- Automated daily PDF report delivered to user's email on weekdays at their chosen time (IST)
- Report contains detailed analysis for every asset in the user's watchlist:

| Report Section | Content |
|---|---|
| **Header** | Finance India branding, report date, user name |
| **Asset Card** (per asset) | Current price, daily change (₹ and %), 7-day sparkline chart |
| **Technical Snapshot** (per asset) | RSI(14), SMA(50), EMA(50), Volatility %, MACD signal, Bollinger Band position |
| **AI Market Summary** | Single Groq-generated cross-asset analysis grounded in all watchlist indicators |
| **Market Overview** | Top movers, index performance, forex/commodity snapshot |

- PDF generated server-side using ReportLab with embedded Matplotlib sparkline charts
- Email delivery via Gmail SMTP with PDF attachment (`FinanceIndia_Report_YYYY-MM-DD.pdf`)
- User configurable: delivery time (30-min increments, 6:00–22:00 IST), enable/disable toggle
- Preview and on-demand "Send Now" options available via API and UI
- Weekday-only delivery (Monday–Friday, skips weekends when Indian markets are closed)

### 8. Background Data Ingestion & Report Scheduler (APScheduler)
- **Price Fetch Job**: Fetches latest prices for all 24 assets every 30 minutes
- **Report Delivery Jobs**: Per-user cron jobs that generate and email PDF reports at each user's chosen weekday time
- **Historical Backfill Job**: Daily midnight job to persist OHLCV data in PostgreSQL
- Market-hours-aware scheduling (9:15 AM – 3:30 PM IST for Indian stocks)

### 9. Redis Caching Layer
| Data Type | Cache TTL |
|---|---|
| Live prices | 60 seconds |
| Computed indicators | 15 minutes |
| AI responses | 30 minutes |
| Asset list | 24 hours |

### 10. Currency Converter (Existing)
- Real-time conversion across 160+ currencies via ExchangeRate API
- Retained from existing application

### 11. Query History
- Automatic logging of user searches
- Recent queries list (last 50) for quick re-access
- Clear history option

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                        │
│  Landing │ Dashboard │ Asset Detail │ Watchlist │ Reports    │
│  Login │ Register │ Converter │ About                        │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS / JWT Bearer Token
┌────────────────────────▼─────────────────────────────────────┐
│                    BACKEND (FastAPI)                          │
│                                                              │
│  Routes:                                                     │
│  /api/assets  /api/market  /api/trends  /api/convert         │
│  /api/auth    /api/watchlist  /api/reports  /api/ai          │
│                                                              │
│  Services:                                                   │
│  ┌─────────────┐ ┌──────────┐ ┌────────────┐ ┌───────────┐ │
│  │Data Provider│ │Auth (JWT)│ │PDF Reports │ │AI Insights│  │
│  │ Frankfurter │ │  bcrypt  │ │ ReportLab  │ │   Groq    │  │
│  │  yfinance   │ │          │ │ Matplotlib │ │ Llama 3.3 │  │
│  └──────┬──────┘ └──────────┘ └─────┬──────┘ └───────────┘  │
│         │                           │                        │
│  ┌──────▼──────┐              ┌─────▼──────┐                │
│  │ APScheduler │              │Email (SMTP)│                 │
│  │  cron jobs  │              │   Gmail    │                 │
│  └─────────────┘              └────────────┘                 │
└───────┬──────────────────┬───────────────────────────────────┘
        │                  │
┌───────▼──────┐    ┌──────▼──────┐
│  PostgreSQL  │    │    Redis    │
│  - assets    │    │  - prices   │
│  - prices    │    │  - indicators│
│  - users     │    │  - AI cache │
│  - watchlists│    │  - rate limit│
│  - rpt_prefs │    │             │
│  - history   │    │             │
└──────────────┘    └─────────────┘
```

---

## Database Schema

**6 tables:**

| Table | Purpose | Key Columns |
|---|---|---|
| `assets` | Registry of all 24 instruments | symbol, name, asset_type, exchange |
| `price_history` | Historical OHLCV time-series | asset_id, date, open, high, low, close, volume |
| `users` | User accounts | email, password_hash, name |
| `watchlist_items` | Per-user watchlist | user_id, asset_id |
| `report_preferences` | Per-user report schedule | user_id, is_enabled, delivery_time, last_sent_at |
| `query_history` | User search log | user_id, asset_symbol, timeframe |

---

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assets` | List all assets (filterable by type) |
| GET | `/api/assets/{symbol}` | Single asset details |
| GET | `/api/assets/{symbol}/price` | Current price (Redis-cached) |
| GET | `/api/assets/{symbol}/history` | Historical data + all indicators |
| GET | `/api/market/overview` | Cross-asset market snapshot |
| GET | `/api/market/heatmap` | Performance heatmap data |
| GET | `/api/trends` | Historical forex trends (backward compat) |
| GET | `/api/convert` | Currency conversion |
| GET | `/api/currencies` | Available currencies |
| GET | `/api/performance` | Global currency performance |

### Authentication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login → JWT tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Current user profile |

### Protected Endpoints (require JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/watchlist` | List user's watchlist |
| POST | `/api/watchlist` | Add asset to watchlist |
| DELETE | `/api/watchlist/{asset_id}` | Remove from watchlist |
| GET | `/api/reports/preferences` | Get user's report preferences |
| PUT | `/api/reports/preferences` | Update delivery time, enable/disable |
| POST | `/api/reports/preview` | Generate and download PDF preview |
| POST | `/api/reports/send-now` | Trigger immediate report delivery |
| GET | `/api/history` | User's query history |
| GET | `/api/ai/insight/{symbol}` | AI insight for asset |
| GET | `/api/ai/market-summary` | AI cross-asset summary |

---

## Phased Build Plan

| Phase | Focus | Key Deliverables |
|---|---|---|
| **Phase 1** | Database + Data Layer | PostgreSQL setup, SQLAlchemy models, yfinance provider, MACD/Bollinger indicators, Redis cache, Docker Compose with Postgres + Redis |
| **Phase 2** | Authentication | JWT auth service, register/login endpoints, password hashing, protected route middleware |
| **Phase 3** | Multi-Asset APIs + Scheduler | Unified asset routes, market overview, APScheduler background jobs, price ingestion pipeline |
| **Phase 4** | PDF Reports + Email Delivery | ReportLab PDF generator, Matplotlib sparklines, Gmail SMTP email service, APScheduler per-user cron jobs, report preference API |
| **Phase 5** | AI Insights | Groq integration, grounded prompt construction, cross-asset AI summary for PDF reports |
| **Phase 6** | Frontend Expansion | Dashboard page, asset detail page, watchlist UI, report settings panel, auth flow, heatmap, AI insight panel |
| **Phase 7** | Frontend Polish & Final Integration | Final UI polish, connect React components to real Phase 4 APIs, end-to-end testing, and deployment preparation |

---

## Environment Variables

```
DATABASE_URL          PostgreSQL connection string
REDIS_URL             Redis connection string
JWT_SECRET_KEY        Secret key for JWT signing
EXCHANGE_API_KEY      ExchangeRate API key (existing)
GROQ_API_KEY          Groq Cloud API key (optional)
GMAIL_USER            Gmail address for notifications (optional)
GMAIL_APP_PASSWORD    Gmail app password (optional)
CORS_ALLOW_ORIGINS    Allowed frontend origins
```

---

## Key Engineering Highlights

| Skill Demonstrated | Implementation |
|---|---|
| **Pluggable Architecture** | Abstract data provider interface — forex, stocks, commodities all feed the same indicator engine |
| **Async Processing** | FastAPI async routes, asyncpg for non-blocking DB queries, aiosmtplib for async email |
| **Scheduled PDF Reports** | Per-user cron-scheduled report generation with ReportLab PDF + embedded Matplotlib sparklines, delivered via async SMTP |
| **Grounded AI Pipeline** | Real computed metrics injected into LLM prompts — prevents hallucination of financial data |
| **Multi-Layer Caching** | Redis (hot) → PostgreSQL (warm) → External API (cold) — minimizes latency and API rate limit hits |
| **Secure Auth** | bcrypt hashing, JWT with expiry, refresh token rotation, protected route middleware |
| **Production Deployment** | Docker Compose orchestrating 4 services (app, db, cache, frontend) |

---

*Document updated: July 2026*
*Repository: finance-india*
