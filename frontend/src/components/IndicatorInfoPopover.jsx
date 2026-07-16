import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { indicatorMeta } from '../data/indicatorMeta';

const IndicatorInfoPopover = ({ indicatorKey, isOpen, onClose }) => {
  const indicator = indicatorMeta[indicatorKey];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !indicator) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close indicator information"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-surface-1 border border-line rounded-2xl shadow-elevated p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-txt-primary">{indicator.name}</h2>
            <p className="text-xs font-medium text-accent mt-1">{indicator.category}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-surface-2 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-muted mb-1">What it measures</h3>
            <p className="text-txt-secondary">{indicator.measures}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-muted mb-1">Why it matters</h3>
            <p className="text-txt-secondary">{indicator.matters}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-muted mb-1">Typical interpretation</h3>
            <p className="text-txt-secondary">{indicator.interpretation}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-muted mb-1">General interpretation</h3>
            <ul className="text-txt-secondary space-y-1">
              {indicator.generalInterpretation.map(item => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-muted mb-1">Things to keep in mind</h3>
            <p className="text-txt-secondary">{indicator.keepInMind}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorInfoPopover;
