import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { apiFetch } from '../utils/api';
import { useWatchlist } from '../context/WatchlistContext';
import MarketTicker from '../components/MarketTicker';
import AssetGrid from '../components/AssetGrid';
import SearchSortBar from '../components/SearchSortBar';

const TABS = [
  { key: 'all',       label: 'All Assets' },
  { key: 'stock',     label: 'Stocks' },
  { key: 'index',     label: 'Indices' },
  { key: 'forex',     label: 'Forex' },
  { key: 'commodity', label: 'Commodities' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { watchlist, isInWatchlist, toggleWatchlist } = useWatchlist();

  const [allAssets, setAllAssets] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  // Fetch all assets + heatmap data (for prices/change)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [assets, heatmap] = await Promise.all([
          apiFetch('/api/assets'),
          apiFetch('/api/market/heatmap'),
        ]);
        setAllAssets(assets);

        // Build price map from heatmap
        const pm = {};
        heatmap.forEach(item => {
          pm[item.symbol] = {
            change_percent: item.change_percent,
            price: null, // heatmap doesn't include price; we'll fetch individually
          };
        });
        setPriceMap(pm);

        // Fetch individual prices for all assets
        const pricePromises = assets.map(async (a) => {
          try {
            const data = await apiFetch(`/api/assets/${a.symbol}/price`);
            return { symbol: a.symbol, ...data };
          } catch {
            return { symbol: a.symbol, price: null, change_percent: pm[a.symbol]?.change_percent || null };
          }
        });
        const priceResults = await Promise.all(pricePromises);
        const newPm = {};
        priceResults.forEach(r => {
          newPm[r.symbol] = {
            price: r.price,
            change_percent: r.change_percent,
          };
        });
        setPriceMap(newPm);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter by tab
  const filteredByTab = useMemo(() => {
    if (activeTab === 'all') return allAssets;
    return allAssets.filter(a => a.asset_type === activeTab);
  }, [allAssets, activeTab]);

  // Filter by search
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTab;
    const q = searchQuery.toLowerCase();
    return filteredByTab.filter(
      a => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  }, [filteredByTab, searchQuery]);

  // Sort
  const sortedAssets = useMemo(() => {
    const arr = [...filteredBySearch];
    const [field, direction] = sortBy.split('-');
    arr.sort((a, b) => {
      let valA, valB;
      if (field === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (field === 'change') {
        valA = priceMap[a.symbol]?.change_percent || 0;
        valB = priceMap[b.symbol]?.change_percent || 0;
      }
      if (field === 'price') {
        valA = priceMap[a.symbol]?.price || 0;
        valB = priceMap[b.symbol]?.price || 0;
      }
      return direction === 'desc' ? valB - valA : valA - valB;
    });
    return arr;
  }, [filteredBySearch, sortBy, priceMap]);

  return (
    <div className="space-y-0">
      {/* Market Ticker */}
      <MarketTicker />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 space-y-6">
        {/* Tab bar + watchlist counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-surface-1 border border-line rounded-xl overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'text-txt-primary'
                    : 'text-txt-muted hover:text-txt-secondary'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="dashboard-tab"
                    className="absolute inset-0 bg-surface-2 rounded-lg border border-line"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <Link
            to="/watchlist"
            className="flex items-center gap-2 px-3 py-1.5 bg-loss/8 text-loss/80 hover:text-loss rounded-lg text-sm font-medium transition-colors"
          >
            <FiHeart className="w-3.5 h-3.5" />
            {watchlist.length} in watchlist
          </Link>
        </div>

        {/* Search + Sort */}
        <SearchSortBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Asset grid */}
        <AssetGrid
          assets={sortedAssets}
          priceMap={priceMap}
          loading={loading}
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={toggleWatchlist}
          onCardClick={(symbol) => navigate(`/asset/${symbol}`)}
          emptyTitle={searchQuery ? 'No matching assets' : 'No assets found'}
          emptySubtitle={searchQuery ? 'Try a different search term.' : 'Assets will appear here once loaded.'}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
