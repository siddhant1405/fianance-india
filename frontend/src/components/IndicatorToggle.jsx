import React from 'react';

const INDICATORS = [
  { key: 'sma',       label: 'SMA 50',   color: '#FFBE0B' },
  { key: 'ema',       label: 'EMA 50',   color: '#FB5607' },
  { key: 'macd',      label: 'MACD',     color: '#8338EC' },
  { key: 'bollinger', label: 'Bollinger', color: '#3A86FF' },
  { key: 'rsi',       label: 'RSI',      color: '#FF006E' },
];

const IndicatorToggle = ({ activeIndicators = [], onToggle }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {INDICATORS.map(ind => {
        const isActive = activeIndicators.includes(ind.key);
        return (
          <button
            key={ind.key}
            onClick={() => onToggle(ind.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              isActive
                ? 'border-transparent text-white'
                : 'border-line text-txt-muted hover:text-txt-primary hover:border-line-hover bg-surface-1'
            }`}
            style={isActive ? { backgroundColor: ind.color + '22', borderColor: ind.color + '44', color: ind.color } : {}}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: isActive ? ind.color : 'var(--text-muted)' }}
            />
            {ind.label}
          </button>
        );
      })}
    </div>
  );
};

export { INDICATORS };
export default IndicatorToggle;
