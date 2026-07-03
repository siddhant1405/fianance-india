import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  subtitle = '',
  ctaText,
  ctaLink,
  onCtaClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center mb-6">
      <Icon className="w-8 h-8 text-txt-muted" />
    </div>
    <h3 className="text-lg font-semibold text-txt-primary mb-2">{title}</h3>
    {subtitle && (
      <p className="text-sm text-txt-muted max-w-sm mb-6">{subtitle}</p>
    )}
    {ctaText && ctaLink && (
      <Link
        to={ctaLink}
        className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
      >
        {ctaText}
      </Link>
    )}
    {ctaText && onCtaClick && !ctaLink && (
      <button
        onClick={onCtaClick}
        className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
      >
        {ctaText}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
