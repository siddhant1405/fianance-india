import React, { useState } from 'react';
import IndicatorInfoPopover from './IndicatorInfoPopover';

const INDICATORS = [
  { key: 'sma',       label: 'SMA 50',   color: '#FFBE0B' },
  { key: 'ema',       label: 'EMA 50',   color: '#FB5607' },
  { key: 'macd',      label: 'MACD',     color: '#8338EC' },
  { key: 'bollinger', label: 'Bollinger', color: '#3A86FF' },
  { key: 'rsi',       label: 'RSI',      color: '#FF006E' },
];

const IndicatorToggle = ({ activeIndicators = [], onToggle }) => {
  const [activePopover, setActivePopover] = useState(null);

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {INDICATORS.map(ind => {
          const isActive = activeIndicators.includes(ind.key);
          return (
            <div
              key={ind.key}
              className={`flex items-center rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'border-transparent'
                  : 'border-line text-txt-muted hover:text-txt-primary hover:border-line-hover bg-surface-1'
              }`}
              style={isActive ? { backgroundColor: ind.color + '22', borderColor: ind.color + '44', color: ind.color } : {}}
            >
              <button
                onClick={() => onToggle(ind.key)}
                aria-pressed={isActive}
                className="flex items-center gap-1.5 px-2.5 py-1.5 focus:outline-none rounded-l-lg"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isActive ? ind.color : 'var(--text-muted)' }}
                />
                {ind.label}
              </button>
              <div className="w-px h-3 bg-line/50" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopover(ind.key);
                }}
                className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none text-txt-muted hover:text-txt-primary transition-colors"
                aria-label={`Info about ${ind.label}`}
              >
                ⓘ
              </button>
            </div>
          );
        })}
      </div>

      <IndicatorInfoPopover
        indicatorKey={activePopover}
        isOpen={!!activePopover}
        onClose={() => setActivePopover(null)}
      />
    </>
  );
};

export { INDICATORS };
export default IndicatorToggle;
