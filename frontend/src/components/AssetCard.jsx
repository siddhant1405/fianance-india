import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const ASSET_TYPE_COLORS = {
  stock:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  index:     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  forex:     'bg-teal-500/10 text-teal-400 border-teal-500/20',
  commodity: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const AssetCard = ({
  symbol,
  name,
  price,
  changePercent,
  assetType,
  isInWatchlist,
  onToggleWatchlist,
  sparklineData,
  onClick,
}) => {
  const isPositive = changePercent >= 0;
  const typeStyle = ASSET_TYPE_COLORS[assetType] || ASSET_TYPE_COLORS.stock;

  // Mini sparkline chart config
  const sparklineConfig = sparklineData && sparklineData.length > 1 ? {
    data: {
      labels: sparklineData.map((_, i) => i),
      datasets: [{
        data: sparklineData,
        borderColor: isPositive ? '#00D26A' : '#FF4757',
        backgroundColor: isPositive ? 'rgba(0,210,106,0.08)' : 'rgba(255,71,87,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1.5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      elements: { line: { borderCapStyle: 'round' } },
    },
  } : null;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative bg-surface-1 border border-line hover:border-line-hover rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-card"
    >
      {/* Clickable card body */}
      <div onClick={onClick} className="space-y-3">
        {/* Top row: type badge + watchlist heart */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${typeStyle}`}>
            {assetType}
          </span>
        </div>

        {/* Symbol + Name */}
        <div>
          <h3 className="text-base font-bold text-txt-primary leading-tight">
            {symbol.replace('.NS', '').replace('=X', '').replace('=F', '').replace('^', '')}
          </h3>
          <p className="text-xs text-txt-muted mt-0.5 truncate">{name}</p>
        </div>

        {/* Sparkline */}
        {sparklineConfig && (
          <div className="h-10 w-full">
            <Line data={sparklineConfig.data} options={sparklineConfig.options} />
          </div>
        )}
        {!sparklineConfig && <div className="h-10" />}

        {/* Price + Change */}
        <div className="flex flex-col">
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold font-mono-num text-txt-primary">
              ₹{price != null ? price.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}
            </span>
            <span className={`flex items-center gap-0.5 text-sm font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {isPositive ? <FiTrendingUp className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
              {changePercent != null ? `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%` : '—'}
            </span>
          </div>
          <span className="text-xs text-txt-muted mt-0.5">
            {assetType === 'forex' ? `per 1 ${symbol.split('INR')[0] || ''}`.trim()
              : assetType === 'stock' ? 'per share'
              : assetType === 'index' ? 'index level'
              : assetType === 'commodity' ? 'per 10g (24K)'
              : ''}
          </span>
        </div>
      </div>

      {/* Heart / watchlist toggle */}
      <button
        onClick={e => { e.stopPropagation(); onToggleWatchlist(symbol); }}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-loss/10 transition-colors z-10"
        aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <motion.div animate={isInWatchlist ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
          <FiHeart
            className={`w-4 h-4 transition-colors ${isInWatchlist ? 'text-loss fill-loss' : 'text-txt-muted hover:text-loss'}`}
            fill={isInWatchlist ? 'currentColor' : 'none'}
          />
        </motion.div>
      </button>
    </motion.div>
  );
};

export default AssetCard;
