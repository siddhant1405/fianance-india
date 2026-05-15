import React, { useState, useEffect, useCallback } from "react";
import { FaArrowUp, FaArrowDown, FaGlobeAmericas, FaSync } from "react-icons/fa";
import { getPerformance } from "../utils/api";

export default function PerformanceCard({ baseCurrency = "USD" }) {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Call our FastAPI backend
      const data = await getPerformance(baseCurrency);
      setPerformanceData(data.performance);
      setLastUpdated(data.last_updated || new Date().toLocaleDateString());
    } catch (err) {
      setError(err.message || "Failed to fetch performance data");
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return (
    <div className="glass-card rounded-2xl shadow-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <FaGlobeAmericas className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Global Performance</h3>
            <p className="text-xs text-text-muted">vs {baseCurrency} · from FastAPI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-text-muted">{lastUpdated}</span>
          )}
          <button 
            onClick={fetchPerformance} 
            className="p-2 rounded-lg hover:bg-bg-hover text-text-muted hover:text-accent transition-all duration-200"
            title="Refresh"
          >
            <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-12 shimmer-loader rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-danger text-sm mb-2">⚠ {error}</p>
            <button onClick={fetchPerformance} className="text-accent text-xs hover:underline">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-text-muted uppercase tracking-widest">
                  <th className="pb-3 font-medium">Pair</th>
                  <th className="pb-3 font-medium text-right">Rate</th>
                  <th className="pb-3 font-medium text-right">7D</th>
                  <th className="pb-3 font-medium text-right">30D</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((data) => (
                  <tr 
                    key={data.currency} 
                    className="border-t border-border/50 hover:bg-bg-hover/50 transition-colors"
                  >
                    <td className="py-3">
                      <span className="font-semibold text-sm text-text-primary">{baseCurrency}/</span>
                      <span className="font-semibold text-sm text-accent">{data.currency}</span>
                    </td>
                    <td className="py-3 text-right font-mono text-sm text-text-primary font-medium">
                      {data.rate}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                        data.week_change >= 0 
                          ? 'text-success bg-success/10' 
                          : 'text-danger bg-danger/10'
                      }`}>
                        {data.week_change >= 0 
                          ? <FaArrowUp className="text-[8px]" /> 
                          : <FaArrowDown className="text-[8px]" />
                        }
                        {Math.abs(data.week_change)}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                        data.month_change >= 0 
                          ? 'text-success bg-success/10' 
                          : 'text-danger bg-danger/10'
                      }`}>
                        {data.month_change >= 0 
                          ? <FaArrowUp className="text-[8px]" /> 
                          : <FaArrowDown className="text-[8px]" />
                        }
                        {Math.abs(data.month_change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
