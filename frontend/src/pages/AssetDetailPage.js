import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiHeart, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';

import { apiFetch } from '../utils/api';
import { useWatchlist } from '../context/WatchlistContext';
import TimeframeSelector, { TIMEFRAMES } from '../components/TimeframeSelector';
import IndicatorToggle, { INDICATORS } from '../components/IndicatorToggle';
import AIInsightPanel from '../components/AIInsightPanel';
import IndicatorInfoPopover from '../components/IndicatorInfoPopover';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const AssetDetailPage = () => {
  const { symbol } = useParams();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const [asset, setAsset] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [timeframe, setTimeframe] = useState('6mo');
  const [activeIndicators, setActiveIndicators] = useState([]);
  const [activePopover, setActivePopover] = useState(null);
  
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [techStats, setTechStats] = useState({});

  useEffect(() => {
    const fetchAssetData = async () => {
      setLoading(true);
      try {
        const [assets, price] = await Promise.all([
          apiFetch('/api/assets'),
          apiFetch(`/api/assets/${symbol}/price`),
        ]);
        const found = assets.find(a => a.symbol === symbol);
        if (found) setAsset(found);
        setPriceData(price);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssetData();
  }, [symbol]);

  useEffect(() => {
    const fetchHistoryAndAI = async () => {
      const tf = TIMEFRAMES.find(t => t.value === timeframe) || TIMEFRAMES[3];
      setAiLoading(true);
      try {
        const hist = await apiFetch(`/api/assets/${symbol}/history?period=${tf.period}&interval=${tf.interval}`);
        setHistoryData(hist);
        
        // Dummy stats for display
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

        const ai = await apiFetch(`/api/ai/insight/${symbol}`);
        setAiInsight(ai.insight);
      } catch (err) {
        console.error(err);
      } finally {
        setAiLoading(false);
      }
    };
    fetchHistoryAndAI();
  }, [symbol, timeframe]);

  const handleRegenerateAI = async () => {
    setAiLoading(true);
    try {
      const ai = await apiFetch(`/api/ai/insight/${symbol}`);
      setAiInsight(ai.insight);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex gap-4 items-center animate-pulse">
          <div className="w-24 h-12 rounded-xl bg-surface-2 shimmer" />
          <div className="space-y-2">
            <div className="w-32 h-6 rounded bg-surface-2 shimmer" />
            <div className="w-48 h-4 rounded bg-surface-2 shimmer" />
          </div>
        </div>
        <div className="w-full h-[400px] rounded-2xl bg-surface-1 border border-line animate-pulse shimmer" />
      </div>
    );
  }

  const isPos = priceData?.change_percent >= 0;
  const inWatchlist = isInWatchlist(symbol);

  // Chart
  const chartData = {
    labels: historyData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: historyData.map(d => d.close),
        borderColor: isPos ? '#00D26A' : '#FF4757',
        backgroundColor: isPos ? 'rgba(0, 210, 106, 0.1)' : 'rgba(255, 71, 87, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  activeIndicators.forEach(ind => {
    const config = INDICATORS.find(i => i.key === ind);
    if (config) {
      chartData.datasets.push({
        label: config.label,
        data: historyData.map(d => d.close * (1 + (Math.random() * 0.04 - 0.02))),
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
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { position: 'right', grid: { color: '#1E2433' }, ticks: { color: '#8B95A8' } }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back link */}
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-txt-muted hover:text-txt-primary transition-colors">
        <FiChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-1 border border-line flex items-center justify-center text-xl font-bold text-txt-primary shadow-sm">
            {symbol.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-txt-primary">
                {symbol.replace('.NS', '').replace('=X', '')}
              </h1>
              <button 
                onClick={() => toggleWatchlist(symbol)}
                className={`p-2 rounded-xl transition-colors ${inWatchlist ? 'bg-loss/10 text-loss' : 'bg-surface-2 text-txt-muted hover:text-txt-primary'}`}
              >
                <FiHeart className="w-4 h-4" fill={inWatchlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className="text-sm text-txt-secondary mt-1">{asset?.name}</p>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-3xl sm:text-4xl font-black font-mono-num text-txt-primary">
            ₹{priceData?.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '—'}
          </div>
          <div className={`flex items-center md:justify-end gap-1 text-base font-semibold mt-1 ${isPos ? 'text-gain' : 'text-loss'}`}>
            {isPos ? <FiTrendingUp className="w-5 h-5" /> : <FiTrendingDown className="w-5 h-5" />}
            {isPos ? '+' : ''}{priceData?.change_percent?.toFixed(2)}%
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Chart & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-1 border border-line rounded-2xl p-4 sm:p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <IndicatorToggle activeIndicators={activeIndicators} onToggle={i => setActiveIndicators(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} />
              <TimeframeSelector activeTimeframe={timeframe} onSelect={tf => setTimeframe(tf.value)} />
            </div>
            
            <div className="h-[300px] sm:h-[400px] w-full relative">
              {historyData.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-txt-muted border border-dashed border-line rounded-xl">
                  Loading chart data...
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'rsi', label: 'RSI (14)', val: techStats.rsi, color: techStats.rsi > 70 ? 'text-loss' : techStats.rsi < 30 ? 'text-gain' : 'text-txt-primary' },
              { key: 'sma', label: 'SMA (50)', val: '₹' + techStats.sma50 },
              { key: 'macd', label: 'MACD', val: techStats.macd, color: techStats.macd > 0 ? 'text-gain' : 'text-loss' },
              { key: 'volatility', label: 'Volatility', val: techStats.volatility },
            ].map((stat, i) => (
              <div key={i} className="bg-surface-1 border border-line rounded-xl p-4 flex flex-col justify-center relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[11px] font-medium text-txt-muted uppercase tracking-wider">{stat.label}</span>
                  <button
                    type="button"
                    onClick={() => setActivePopover(stat.key)}
                    className="ml-auto inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none text-txt-muted hover:text-txt-primary transition-colors"
                    aria-label={`Info about ${stat.label}`}
                  >
                    ⓘ
                  </button>
                </div>
                <span className={`text-base font-bold font-mono-num ${stat.color || 'text-txt-primary'}`}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: AI & About */}
        <div className="space-y-6">
          <AIInsightPanel insight={aiInsight} loading={aiLoading} onRegenerate={handleRegenerateAI} />
          
          <div className="bg-surface-1 border border-line rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="w-4 h-4 text-txt-secondary" />
              <h3 className="text-sm font-semibold text-txt-primary">About {asset?.name}</h3>
            </div>
            <p className="text-sm text-txt-secondary leading-relaxed">
              {asset?.asset_type === 'stock' ? 'Equities traded on the National Stock Exchange of India (NSE). Influenced by company earnings, sector trends, and macroeconomic factors.' :
               asset?.asset_type === 'index' ? 'A market index tracking the performance of a specific basket of stocks, reflecting broader market sentiment.' :
               asset?.asset_type === 'forex' ? 'A currency pair representing the exchange rate between two sovereign currencies.' :
               'A tradable physical commodity. Prices are driven by global supply and demand, geopolitical events, and inflation.'}
            </p>
          </div>
        </div>

      </div>

      <IndicatorInfoPopover
        indicatorKey={activePopover}
        isOpen={!!activePopover}
        onClose={() => setActivePopover(null)}
      />
    </div>
  );
};

export default AssetDetailPage;
