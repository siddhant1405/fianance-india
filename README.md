# Finance India — AI-Powered Multi-Asset Financial Intelligence Platform

A full-stack financial analytics platform that provides real-time market intelligence across multiple asset classes relevant to the Indian market. Built with **React** (frontend) and **FastAPI** (backend), it combines technical indicator computation, scheduled PDF report delivery, and AI-generated insights powered by Groq (Llama 3.3 70B).

## Asset Universe

| Category | Assets Covered | Data Source |
|---|---|---|
| **Forex (INR Pairs)** | USD/INR, EUR/INR, GBP/INR, JPY/INR, AED/INR, SGD/INR, CAD/INR, AUD/INR, CHF/INR, CNY/INR | Frankfurter API + yfinance |
| **Indian Stocks** | Top 100 Indian Equities | yfinance (NSE) |
| **Market Indices** | Nifty 50, Sensex | yfinance |
| **Commodities** | Gold, Silver | yfinance |

## Architecture

```text
finance-india/
|-- backend/                  # FastAPI Python backend
|   |-- app/
|   |   |-- main.py           # FastAPI app entry point
|   |   |-- routes/           # API routes (auth, assets, ai, reports)
|   |   |-- services/         # Data fetchers, AI, PDF generation, Email
|   |   |-- db/               # PostgreSQL & Redis integrations
|   |   `-- utils/            # Indicator computations (SMA, RSI, etc.)
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend/                 # React UI
|   |-- src/
|   `-- package.json
|-- docker-compose.yml        # Orchestrates App, Postgres, and Redis
|-- netlify.toml
|-- render.yaml
`-- README.md
```

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Use `backend/.env` for local backend environment variables (requires Postgres & Redis credentials).

Backend will be live at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Use `frontend/.env` if you want to override the backend URL locally.
Frontend will be live at: `http://localhost:3000`

### 3. Docker (Local)

Make sure `backend/.env` exists with your local backend environment variables (`DATABASE_URL`, `REDIS_URL`, etc.).

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Core Features

- **Multi-Asset Dashboard** - Unified view of equities, forex, indices, and commodities.
- **Technical Indicator Engine** - Server-side computed SMA, EMA, RSI, MACD, Bollinger Bands, Volatility, and Momentum.
- **AI-Powered Insights** - Llama 3.3 70B (via Groq) dynamically grounded in live computed metrics to provide hallucination-free technical analysis.
- **Automated Daily Reports** - APScheduler and Gmail SMTP trigger user-personalized PDF reports containing Matplotlib sparkline charts of their watchlist assets.
- **Authentication & Watchlists** - JWT-secured personalized watchlists and user preferences.
- **Multi-Layer Caching** - Redis used for hot price data, indicator caching, and LLM response caching to ensure ultra-low latency.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Chart.js, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python, APScheduler, Pydantic |
| Database | PostgreSQL (persistent), Redis (cache) |
| AI Engine | Groq Cloud (Llama 3.3 70B) |
| PDF & Email | ReportLab, Matplotlib, aiosmtplib (Gmail SMTP) |
| APIs | yfinance, Frankfurter API, ExchangeRate API |

