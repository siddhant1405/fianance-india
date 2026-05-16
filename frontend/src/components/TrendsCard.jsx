import React, { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { exportToCSV, exportToJSON } from "../utils/analytics";
import { getTrends } from "../utils/api";
import { FaDownload, FaChartLine, FaFileExport } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler);

export default function TrendsCard({
  frankfurterCurrencies,
  trendFrom,
  trendTo,
  setTrendFrom,
  setTrendTo,
}) {
  const [timeframe, setTimeframe] = useState("1Y");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    volatility: 0, latestRate: 0, sma: 0, smaPeriod: 50,
    highRate: 0, lowRate: 0, avgRate: 0, change: 0, changePercent: 0
  });
  const [rawData, setRawData] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  const fetchHistoricalData = useCallback(async () => {
    if (trendFrom === trendTo) {
      setError("Base and quote currency must be different.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Call our FastAPI backend — all analytics computed server-side
      const data = await getTrends(trendFrom, trendTo, timeframe);

      const { dates, rates, indicators, volatility, statistics } = data;

      setRawData(data);

      setMetrics({
        volatility: volatility,
        latestRate: statistics.last?.toFixed(4) || "0",
        sma: indicators.sma.values.filter(v => v !== null).slice(-1)[0]?.toFixed(4) || "0",
        smaPeriod: indicators.sma.period,
        highRate: statistics.high?.toFixed(4) || "0",
        lowRate: statistics.low?.toFixed(4) || "0",
        avgRate: statistics.average?.toFixed(4) || "0",
        change: statistics.change?.toFixed(4) || "0",
        changePercent: statistics.change_percent?.toFixed(2) || "0",
      });

      const isPositive = statistics.change >= 0;

      setChartData({
        labels: dates,
        datasets: [
          {
            label: `${trendFrom}/${trendTo}`,
            data: rates,
            borderColor: isPositive ? "#10b981" : "#ef4444",
            backgroundColor: isPositive
              ? "rgba(16, 185, 129, 0.08)"
              : "rgba(239, 68, 68, 0.08)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHitRadius: 10,
            fill: true
          },
          {
            label: `SMA ${indicators.sma.period}`,
            data: indicators.sma.values,
            borderColor: "#f59e0b",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          },
          {
            label: `EMA ${indicators.ema.period}`,
            data: indicators.ema.values,
            borderColor: "#8b5cf6",
            borderWidth: 1,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false
          }
        ]
      });
    } catch (err) {
      setError(err.message || "Failed to load historical data.");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [trendFrom, trendTo, timeframe]);

  useEffect(() => {
    if (trendFrom && trendTo && frankfurterCurrencies.length > 0) {
      fetchHistoricalData();
    }
  }, [fetchHistoricalData, frankfurterCurrencies.length, trendFrom, trendTo]);

  const handleExportCSV = () => {
    if (!rawData) return;
    const csvData = [["Date", "Rate"], ...rawData.dates.map((d, i) => [d, rawData.rates[i]])];
    exportToCSV(csvData, `${trendFrom}_${trendTo}_${timeframe}.csv`);
    setExportOpen(false);
  };

  const handleExportJSON = () => {
    if (!rawData) return;
    exportToJSON(rawData, `${trendFrom}_${trendTo}_${timeframe}.json`);
    setExportOpen(false);
  };

  const isPositive = parseFloat(metrics.changePercent) >= 0;

  return (
    <div className="glass-card rounded-2xl shadow-card overflow-hidden animate-fade-in-up">
      {/* Top Bar */}
      <div className="p-6 pb-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FaChartLine className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Time-Series Analysis</h2>
              <p className="text-xs text-text-muted">Analytics computed server-side via FastAPI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Timeframe Selector */}
            <div className="flex items-center bg-bg-input p-1 rounded-lg border border-border">
              {["1W", "1M", "3M", "6M", "1Y", "5Y"].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    timeframe === tf 
                      ? 'bg-accent text-white shadow-glow' 
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <div className="relative">
              <button 
                onClick={() => setExportOpen(!exportOpen)}
                className="p-2.5 rounded-lg border border-border hover:border-accent bg-bg-input hover:bg-accent/10 text-text-muted hover:text-accent transition-all duration-200"
                title="Export Data"
              >
                <FaFileExport className="text-sm" />
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-2 bg-bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50 w-44 animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
                  <button onClick={handleExportCSV} className="w-full px-4 py-3 text-left text-sm hover:bg-bg-hover flex items-center gap-3 transition-colors">
                    <FaDownload className="text-success text-xs" />
                    <span>Export as CSV</span>
                  </button>
                  <button onClick={handleExportJSON} className="w-full px-4 py-3 text-left text-sm hover:bg-bg-hover flex items-center gap-3 border-t border-border transition-colors">
                    <FaDownload className="text-accent text-xs" />
                    <span>Export as JSON</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Currency Selectors + Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1 font-medium">Base</label>
            <select
              value={trendFrom}
              onChange={(e) => setTrendFrom(e.target.value)}
              className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            >
              {frankfurterCurrencies.map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1 font-medium">Quote</label>
            <select
              value={trendTo}
              onChange={(e) => setTrendTo(e.target.value)}
              className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            >
              {frankfurterCurrencies.map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </div>

          <div className="bg-bg-input rounded-lg p-3 border border-border">
            <span className="text-[10px] text-text-muted uppercase tracking-widest block">Latest</span>
            <span className="text-base font-bold font-mono text-text-primary">{metrics.latestRate}</span>
          </div>

          <div className="bg-bg-input rounded-lg p-3 border border-border">
            <span className="text-[10px] text-text-muted uppercase tracking-widest block">Change</span>
            <span className={`text-base font-bold font-mono ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '+' : ''}{metrics.changePercent}%
            </span>
          </div>

          <div className="bg-bg-input rounded-lg p-3 border border-border">
            <span className="text-[10px] text-text-muted uppercase tracking-widest block">Volatility</span>
            <span className="text-base font-bold font-mono text-warning">{metrics.volatility}%</span>
          </div>
          
          <div className="bg-bg-input rounded-lg p-3 border border-border">
            <span className="text-[10px] text-text-muted uppercase tracking-widest block">SMA {metrics.smaPeriod}</span>
            <span className="text-base font-bold font-mono text-text-primary">{metrics.sma}</span>
          </div>
        </div>

        {/* High / Low / Avg bar */}
        {!loading && !error && chartData && (
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span className="text-text-muted">H:</span>
              <span className="font-mono font-semibold text-text-primary">{metrics.highRate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
              <span className="text-text-muted">L:</span>
              <span className="font-mono font-semibold text-text-primary">{metrics.lowRate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span className="text-text-muted">Avg:</span>
              <span className="font-mono font-semibold text-text-primary">{metrics.avgRate}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="h-80 shimmer-loader rounded-xl flex items-center justify-center">
            <span className="text-text-muted text-sm">Loading from backend...</span>
          </div>
        ) : error ? (
          <div className="h-80 flex flex-col items-center justify-center bg-bg-input rounded-xl border border-border">
            <span className="text-danger text-sm mb-2">⚠ {error}</span>
            <button onClick={fetchHistoricalData} className="text-accent text-xs hover:underline">Try again</button>
          </div>
        ) : chartData ? (
          <div className="h-80 bg-bg-input p-4 rounded-xl border border-border">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { 
                  legend: { 
                    position: "top", align: "end",
                    labels: { color: '#64748B', usePointStyle: true, pointStyle: 'line', font: { size: 11, family: 'Inter' } } 
                  },
                  tooltip: { 
                    backgroundColor: 'rgba(13, 17, 23, 0.95)', titleColor: '#E2E8F0', bodyColor: '#94A3B8', 
                    borderColor: '#1E2533', borderWidth: 1, padding: 12,
                    bodyFont: { family: 'JetBrains Mono', size: 12 },
                    titleFont: { family: 'Inter', size: 12 },
                    displayColors: true, cornerRadius: 8,
                  }
                },
                scales: { 
                  y: { grid: { color: 'rgba(30, 37, 51, 0.5)', drawBorder: false }, ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }, border: { display: false } },
                  x: { grid: { display: false, drawBorder: false }, ticks: { color: '#64748B', maxTicksLimit: 8, font: { family: 'Inter', size: 10 } }, border: { display: false } }
                }
              }}
            />
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-bg-input rounded-xl border border-border">
            <span className="text-text-muted text-sm">Select a currency pair to begin</span>
          </div>
        )}
      </div>
    </div>
  );
}
