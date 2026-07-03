import React from 'react';
import AssetCard from './AssetCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import { FiSearch } from 'react-icons/fi';

const AssetGrid = ({
  assets = [],
  priceMap = {},
  loading = false,
  isInWatchlist,
  onToggleWatchlist,
  onCardClick,
  emptyTitle = 'No assets found',
  emptySubtitle = 'Try adjusting your search or filters.',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        icon={FiSearch}
        title={emptyTitle}
        subtitle={emptySubtitle}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map(asset => {
        const priceData = priceMap[asset.symbol] || {};
        return (
          <AssetCard
            key={asset.symbol}
            symbol={asset.symbol}
            name={asset.name}
            price={priceData.price ?? null}
            changePercent={priceData.change_percent ?? null}
            assetType={asset.asset_type}
            isInWatchlist={isInWatchlist(asset.symbol)}
            onToggleWatchlist={onToggleWatchlist}
            sparklineData={priceData.sparkline}
            onClick={() => onCardClick(asset.symbol)}
          />
        );
      })}
    </div>
  );
};

export default AssetGrid;
