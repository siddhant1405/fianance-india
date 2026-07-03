# Currency Hub - Forex Analytics Dashboard

A full-stack forex analytics dashboard built with **React** (frontend) and **FastAPI** (backend).

## Architecture

```text
currency-converter-app/
|-- backend/                  # FastAPI Python backend
|   |-- app/
|   |   |-- main.py           # FastAPI app entry point
|   |   |-- routes/
|   |   |   |-- currencies.py # GET /api/currencies
|   |   |   |-- conversion.py # GET /api/convert
|   |   |   |-- trends.py     # GET /api/trends
|   |   |   `-- performance.py# GET /api/performance
|   |   |-- services/
|   |   |   |-- frankfurter.py
|   |   |   `-- exchangerate.py
|   |   `-- utils/
|   |       `-- analytics.py
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   `-- package.json
|-- docker-compose.yml
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

Use `backend/.env` for local backend environment variables.

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

### 3. Docker (local)

Make sure `backend/.env` exists with your local backend environment variables.

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:8000`

## Deployment

### Render (backend)

Use the included [render.yaml](/C:/Users/manoj/Desktop/code/projects/finance-india/render.yaml) or create a Render Web Service that points at the `backend` directory and uses Docker.

Set these environment variables in Render:

- `EXCHANGE_API_KEY`: your ExchangeRate API key
- `CORS_ALLOW_ORIGINS`: your Netlify site URL, for example `https://your-site.netlify.app`
- `PORT`: `8000`

Once deployed, your backend URL will look like:

```text
https://your-render-service.onrender.com
```

### Netlify (frontend)

Deploy the `frontend` directory as a separate Netlify site.

Build settings:

- Build command: `npm run build`
- Publish directory: `build`

Set this environment variable in Netlify:

- `REACT_APP_API_URL`: your Render backend URL, for example `https://your-render-service.onrender.com`

The included [netlify.toml](/C:/Users/manoj/Desktop/code/projects/finance-india/netlify.toml) adds an SPA redirect so React Router routes like `/convert` and `/about` work on refresh.

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

- **Currency Converter** - Real-time conversion via ExchangeRate API
- **Time-Series Analysis** - Historical charts with SMA, EMA overlays and configurable timeframes (1W-5Y)
- **Statistical Indicators** - Annualized volatility, RSI, high/low/avg computed server-side
- **Global Performance** - 7D/30D change tracking for major currency pairs
- **Data Export** - Download historical data as CSV or JSON
- **Dark Theme** - Professional financial dashboard UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Chart.js, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python, httpx (async HTTP), Pydantic |
| APIs | Frankfurter (historical), ExchangeRate API (conversion) |
