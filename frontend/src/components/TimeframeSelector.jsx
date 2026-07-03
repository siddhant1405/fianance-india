import React from 'react';
import { motion } from 'framer-motion';

const TIMEFRAMES = [
  { label: '1W',  value: '5d',  period: '5d',  interval: '1h' },
  { label: '1M',  value: '1mo', period: '1mo', interval: '1d' },
  { label: '3M',  value: '3mo', period: '3mo', interval: '1d' },
  { label: '6M',  value: '6mo', period: '6mo', interval: '1d' },
  { label: '1Y',  value: '1y',  period: '1y',  interval: '1d' },
  { label: '5Y',  value: '5y',  period: '5y',  interval: '1wk' },
];

const TimeframeSelector = ({ activeTimeframe, onSelect }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl">
      {TIMEFRAMES.map(tf => (
        <button
          key={tf.value}
          onClick={() => onSelect(tf)}
          className="relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors z-10"
        >
          {activeTimeframe === tf.value && (
            <motion.div
              layoutId="timeframe-pill"
              className="absolute inset-0 bg-accent rounded-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${activeTimeframe === tf.value ? 'text-white' : 'text-txt-muted hover:text-txt-primary'}`}>
            {tf.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export { TIMEFRAMES };
export default TimeframeSelector;
