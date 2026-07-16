import React, { useMemo, useState } from 'react';
import { getIndicatorKeyByName, indicatorAliases } from '../data/indicatorMeta';
import IndicatorInfoPopover from './IndicatorInfoPopover';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const AIInsightText = ({ text }) => {
  const [activeIndicator, setActiveIndicator] = useState(null);
  const content = text || 'No AI insight available for this asset.';

  const parts = useMemo(() => {
    const pattern = indicatorAliases.map(item => escapeRegExp(item.alias)).join('|');
    return content.split(new RegExp(`\\b(${pattern})\\b`, 'gi'));
  }, [content]);

  return (
    <>
      <p className="text-sm text-txt-secondary leading-relaxed relative z-10">
        {parts.map((part, index) => {
          const indicatorKey = getIndicatorKeyByName(part);

          if (!indicatorKey) {
            return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
          }

          return (
            <span
              key={`${part}-${index}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndicator(indicatorKey)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActiveIndicator(indicatorKey);
                }
              }}
              className="text-accent underline cursor-pointer"
            >
              {part}
            </span>
          );
        })}
      </p>

      <IndicatorInfoPopover
        indicatorKey={activeIndicator}
        isOpen={!!activeIndicator}
        onClose={() => setActiveIndicator(null)}
      />
    </>
  );
};

export default AIInsightText;
