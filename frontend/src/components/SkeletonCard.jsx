import React from 'react';

const SkeletonCard = () => (
  <div className="bg-surface-1 border border-line rounded-2xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-2 shimmer" />
        <div className="space-y-2">
          <div className="w-20 h-4 rounded bg-surface-2 shimmer" />
          <div className="w-28 h-3 rounded bg-surface-2 shimmer" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-surface-2 shimmer" />
    </div>
    <div className="w-full h-12 rounded bg-surface-2 shimmer" />
    <div className="flex items-center justify-between">
      <div className="w-24 h-6 rounded bg-surface-2 shimmer" />
      <div className="w-16 h-5 rounded bg-surface-2 shimmer" />
    </div>
  </div>
);

export default SkeletonCard;
