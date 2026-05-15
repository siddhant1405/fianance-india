/**
 * API client for the Currency Hub FastAPI backend.
 * All external API calls are proxied through the backend.
 */

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.append(key, val);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Get all available currencies.
 */
export async function getCurrencies() {
  const data = await apiFetch("/api/currencies");
  return data.currencies;
}

/**
 * Convert currency.
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {number} amount - Amount to convert
 */
export async function convertCurrency(from, to, amount) {
  return apiFetch("/api/convert", { from, to, amount });
}

/**
 * Get historical trends with analytics.
 * @param {string} from - Base currency
 * @param {string} to - Quote currency
 * @param {string} timeframe - 1W, 1M, 3M, 6M, 1Y, 5Y
 */
export async function getTrends(from, to, timeframe) {
  return apiFetch("/api/trends", { from, to, timeframe });
}

/**
 * Get global performance data.
 * @param {string} base - Base currency to compare against
 */
export async function getPerformance(base) {
  return apiFetch("/api/performance", { base });
}

/**
 * Health check.
 */
export async function healthCheck() {
  return apiFetch("/health");
}
