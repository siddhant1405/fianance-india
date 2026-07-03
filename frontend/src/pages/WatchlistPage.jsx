import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiTrendingUp, FiTrendingDown, FiChevronLeft } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';

import { useWatchlist } from '../context/WatchlistContext';
import { apiFetch } from '../utils/api';
import EmptyState from '../components/EmptyState';
import TimeframeSelector, { TIMEFRAMES } from '../components/TimeframeSelector';
import IndicatorToggle, { INDICATORS } from '../components/IndicatorToggle';
import AIInsightPanel from '../components/AIInsightPanel';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist, loading: watchlistLoading } = useWatchlist();
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Detail panel state
  const [historyData, setHistoryData] = useState([]);
  const [timeframe, setTimeframe] = useState('6mo');
  const [activeIndicators, setActiveIndicators] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [techStats, setTechStats] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-select first item if none selected
  useEffect(() => {
    if (!selectedSymbol && watchlist.length > 0) {
      setSelectedSymbol(watchlist[0].asset_symbol);
    }
  }, [watchlist, selectedSymbol]);

  // Fetch full asset info for selected
  useEffect(() => {
    if (!selectedSymbol) return;
    const fetchAsset = async () => {
      try {
        const assets = await apiFetch('/api/assets');
        const asset = assets.find(a => a.symbol === selectedSymbol);
        if (asset) setSelectedAsset(asset);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAsset();
  }, [selectedSymbol]);

  // Fetch history + insight when symbol or timeframe changes
  useEffect(() => {
    if (!selectedSymbol) return;
    
    const fetchDetail = async () => {
      setDetailLoading(true);
      setAiLoading(true);
      
      const tf = TIMEFRAMES.find(t => t.value === timeframe) || TIMEFRAMES[3];
      
      try {
        // Fetch history
        const hist = await apiFetch(`/api/assets/${selectedSymbol}/history?period=${tf.period}&interval=${tf.interval}`);
        setHistoryData(hist);
        
        // Compute dummy tech stats based on last price just for display if we don't have an endpoint for it
        if (hist.length > 0) {
          const last = hist[hist.length - 1].close;
          setTechStats({
            rsi: (40 + Math.random() * 30).toFixed(1),
            sma50: (last * 0.98).toFixed(2),
            ema50: (last * 0.99).toFixed(2),
            macd: (Math.random() * 2 - 1).toFixed(2),
            volatility: (Math.random() * 2).toFixed(2) + '%',
          });
        }

        // Fetch AI
        const ai = await apiFetch(`/api/ai/insight/${selectedSymbol}`);
        setAiInsight(ai.insight);
      } catch (err) {
        console.error(err);
      } finally {
        setDetailLoading(false);
        setAiLoading(false);
      }
    };
    
    fetchDetail();
  }, [selectedSymbol, timeframe]);

  const handleRegenerateAI = async () => {
    if (!selectedSymbol) return;
    setAiLoading(true);
    try {
      const ai = await apiFetch(`/api/ai/insight/${selectedSymbol}`);
      setAiInsight(ai.insight);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleIndicator = (ind) => {
    setActiveIndicators(prev => 
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  // Chart setup
  const chartData = {
    labels: historyData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: historyData.map(d => d.close),
        borderColor: '#00D26A',
        backgroundColor: 'rgba(0, 210, 106, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  // Add dummy indicators if selected
  activeIndicators.forEach(ind => {
    const config = INDICATORS.find(i => i.key === ind);
    if (config) {
      chartData.datasets.push({
        label: config.label,
        data: historyData.map(d => d.close * (1 + (Math.random() * 0.04 - 0.02))), // Fake indicator data
        borderColor: config.color,
        borderDash: [5, 5],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        tension: 0.4,
      });
    }
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#12151C',
        titleColor: '#E8ECF4',
        bodyColor: '#8B95A8',
        borderColor: '#1E2433',
        borderWidth: 1,
        padding: 10,
      }
    },
    scales: {
      x: { display: false },
      y: { 
        position: 'right',
        grid: { color: '#1E2433' },
        ticks: { color: '#8B95A8' }
      }
    }
  };

  if (watchlistLoading && watchlist.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <EmptyState
          icon={FiHeart}
          title="Your watchlist is empty"
          subtitle="Keep track of your favorite assets by adding them from the dashboard."
          ctaText="Browse Assets"
          ctaLink="/dashboard"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] max-w-[1600px] mx-auto bg-surface-0 relative overflow-hidden">
      
      {/* ── Left Sidebar: Watchlist ────────────────────────── */}
      <div className={`w-full lg:w-[380px] flex-shrink-0 flex flex-col border-r border-line bg-surface-0 transition-transform duration-300 ${
        selectedSymbol ? 'hidden lg:flex' : 'flex'
      }`}>
        <div className="px-6 py-5 border-b border-line flex-shrink-0">
          <h2 className="text-lg font-bold text-txt-primary">My Watchlist</h2>
          <p className="text-sm text-txt-muted">{watchlist.length} assets tracking</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">
          {watchlist.map(item => {
            const isSelected = selectedSymbol === item.asset_symbol;
            const isPos = item.change_percent >= 0;
            return (
              <button
                key={item.asset_symbol}
                onClick={() => setSelectedSymbol(item.asset_symbol)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-surface-2 border-accent/30 shadow-glow' 
                    : 'bg-surface-1 border-line hover:border-line-hover hover:bg-surface-2/50'
                } border`}
              >
                <div className="text-left">
                  <div className="font-bold text-sm text-txt-primary">{item.asset_symbol.replace('.NS', '').replace('=X', '')}</div>
                  <div className="text-xs text-txt-muted font-mono-num mt-0.5">
                    ₹{item.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '—'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPos ? 'text-gain' : 'text-loss'}`}>
                    {isPos ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                    {item.change_percent ? `${isPos ? '+' : ''}${item.change_percent.toFixed(2)}%` : '—'}
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.asset_symbol); }}
                    className="p-1.5 text-loss/70 hover:text-loss hover:bg-loss/10 rounded-md transition-colors"
                  >
                    <FiHeart className="w-4 h-4" fill="currentColor" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Area: Detail View ──────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedSymbol && (
          <motion.div
            key={selectedSymbol}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`flex-1 flex flex-col bg-surface-0 overflow-y-auto ${!selectedSymbol ? 'hidden lg:flex' : 'flex'}`}
          >
            {/* Header (Mobile Back Button) */}
            <div className="lg:hidden flex items-center px-4 py-3 border-b border-line bg-surface-0 sticky top-0 z-10">
              <button 
                onClick={() => setSelectedSymbol(null)}
                className="flex items-center gap-1 text-sm font-medium text-txt-secondary hover:text-txt-primary"
              >
                <FiChevronLeft className="w-5 h-5" /> Back to list
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
              
              {/* Top Row: Info + Timeframe */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-txt-primary">
                    {selectedSymbol.replace('.NS', '').replace('=X', '')}
                  </h1>
                  <p className="text-sm text-txt-secondary mt-1">{selectedAsset?.name || 'Loading...'}</p>
                </div>
                <TimeframeSelector activeTimeframe={timeframe} onSelect={(tf) => setTimeframe(tf.value)} />
              </div>

              {/* Chart Card */}
              <div className="bg-surface-1 border border-line rounded-2xl p-4 sm:p-6 shadow-card">
                <div className="mb-4">
                  <IndicatorToggle activeIndicators={activeIndicators} onToggle={toggleIndicator} />
                </div>
                
                <div className="h-[300px] sm:h-[400px] w-full relative">
                  {detailLoading && (
                    <div className="absolute inset-0 z-10 bg-surface-1/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    </div>
                  )}
                  {historyData.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : !detailLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-sm text-txt-muted border border-dashed border-line rounded-xl">
                      No chart data available
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Tech Stats Row */}
              {Object.keys(techStats).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'RSI (14)', val: techStats.rsi, color: techStats.rsi > 70 ? 'text-loss' : techStats.rsi < 30 ? 'text-gain' : 'text-txt-primary' },
                    { label: 'SMA (50)', val: '₹' + techStats.sma50 },
                    { label: 'EMA (50)', val: '₹' + techStats.ema50 },
                    { label: 'MACD', val: techStats.macd, color: techStats.macd > 0 ? 'text-gain' : 'text-loss' },
                    { label: 'Volatility', val: techStats.volatility },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-1 border border-line rounded-xl p-3 flex flex-col justify-center">
                      <span className="text-[11px] font-medium text-txt-muted uppercase tracking-wider mb-1">{stat.label}</span>
                      <span className={`text-sm font-bold font-mono-num ${stat.color || 'text-txt-primary'}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Insight */}
              <AIInsightPanel 
                insight={aiInsight} 
                loading={aiLoading} 
                onRegenerate={handleRegenerateAI}
                className="mt-4"
              />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WatchlistPage;
