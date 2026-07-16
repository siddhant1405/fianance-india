import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiRefreshCw } from 'react-icons/fi';
import AIInsightText from './AIInsightText';

const AIInsightPanel = ({ insight, loading = false, onRegenerate, className = '' }) => {
  if (loading) {
    return (
      <div className={`relative bg-surface-1 rounded-2xl p-6 overflow-hidden ai-border ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ai-muted text-ai text-xs font-semibold">
            <FiActivity className="w-3 h-3" /> AI
          </span>
          <div className="w-28 h-4 rounded shimmer" />
        </div>
        <div className="space-y-2.5">
          <div className="w-full h-3.5 rounded shimmer" />
          <div className="w-full h-3.5 rounded shimmer" />
          <div className="w-3/4 h-3.5 rounded shimmer" />
          <div className="w-5/6 h-3.5 rounded shimmer" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-surface-1 rounded-2xl p-6 overflow-hidden ai-border ${className}`}
    >
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-ai/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ai-muted text-ai text-xs font-semibold">
            <FiActivity className="w-3 h-3" /> AI
          </span>
          <span className="text-sm font-semibold text-txt-primary">Analyst Insight</span>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-txt-muted hover:text-ai bg-surface-2 hover:bg-ai-muted rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        )}
      </div>

      <AIInsightText text={insight} />
    </motion.div>
  );
};

export default AIInsightPanel;
