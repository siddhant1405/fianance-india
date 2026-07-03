import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { apiFetch } from '../utils/api';

const SYMBOL_LABELS = {
  '^NSEI':     'Nifty 50',
  '^BSESN':    'Sensex',
  'USDINR=X':  'USD/INR',
  'GC=F':      'Gold',
};

const MarketTicker = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const overview = await apiFetch('/api/market/overview');
        setData(overview);
      } catch (err) {
        console.error('Market overview failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
    // Refresh every 5 minutes
    const interval = setInterval(fetchOverview, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-6 px-4 py-3 bg-surface-1 border-b border-line overflow-x-auto">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-16 h-3 rounded shimmer" />
            <div className="w-20 h-4 rounded shimmer" />
            <div className="w-14 h-3 rounded shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div className="bg-surface-1 border-b border-line">
      <div className="flex items-center gap-1 px-4 py-2.5 overflow-x-auto scrollbar-none">
        {data.map((item, idx) => {
          const isPositive = item.change_percent >= 0;
          return (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 px-4 py-1.5 rounded-lg whitespace-nowrap"
            >
              <span className="text-xs font-medium text-txt-muted">
                {SYMBOL_LABELS[item.symbol] || item.symbol}
              </span>
              <span className="text-sm font-semibold font-mono-num text-txt-primary">
                {item.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-gain' : 'text-loss'}`}>
                {isPositive ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{item.change_percent?.toFixed(2)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketTicker;
