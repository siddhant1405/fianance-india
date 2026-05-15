# Currency Hub — Forex Analytics Dashboard

A full-stack forex analytics dashboard built with **React** (frontend) and **FastAPI** (backend).

## Architecture

```
currency-converter-app/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── routes/
│   │   │   ├── currencies.py # GET /api/currencies
│   │   │   ├── conversion.py # GET /api/convert
│   │   │   ├── trends.py     # GET /api/trends (with SMA, EMA, RSI, volatility)
│   │   │   └── performance.py# GET /api/performance
│   │   ├── services/
│   │   │   ├── frankfurter.py # Frankfurter API client
│   │   │   └── exchangerate.py# ExchangeRate API client
│   │   └── utils/
│   │       └── analytics.py  # SMA, EMA, RSI, volatility calculations
│   ├── .env                  # API keys (not committed)
│   └── requirements.txt
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Route pages
│   │   └── utils/
│   │       ├── api.js        # Backend API client
│   │       └── analytics.js  # Client-side export utilities
│   ├── .env                  # Backend URL config
│   └── package.json
└── README.md
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

Backend will be live at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend will be live at: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/currencies` | List all available currencies |
| GET | `/api/convert?from=USD&to=INR&amount=100` | Convert currency |
| GET | `/api/trends?from=USD&to=INR&timeframe=1Y` | Historical data + SMA, EMA, RSI, volatility |
| GET | `/api/performance?base=USD` | Global 7D/30D performance |
| GET | `/docs` | Interactive Swagger API docs |
| GET | `/health` | Health check |

## Features

- **Currency Converter** — Real-time conversion via ExchangeRate API
- **Time-Series Analysis** — Historical charts with SMA, EMA overlays and configurable timeframes (1W–5Y)
- **Statistical Indicators** — Annualized volatility, RSI, high/low/avg computed server-side
- **Global Performance** — 7D and 30D change tracking for major currency pairs
- **Data Export** — Download historical data as CSV or JSON
- **Dark Theme** — Professional financial dashboard UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Chart.js, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python, httpx (async HTTP), Pydantic |
| APIs | Frankfurter (historical), ExchangeRate API (conversion) |
