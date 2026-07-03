import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWatchlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiFetch('/api/watchlist');
      setWatchlist(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const isInWatchlist = useCallback((symbol) => {
    return watchlist.some(item => item.asset_symbol === symbol);
  }, [watchlist]);

  const addToWatchlist = useCallback(async (symbol) => {
    // Optimistic update
    const prevWatchlist = [...watchlist];
    setWatchlist(prev => [...prev, { asset_symbol: symbol, price: null, change_percent: null }]);

    try {
      await apiFetch('/api/watchlist', {
        method: 'POST',
        body: { asset_symbol: symbol },
      });
      addToast('Added to watchlist', 'success');
      // Refresh to get full price data
      refreshWatchlist();
    } catch (err) {
      // Rollback
      setWatchlist(prevWatchlist);
      addToast(err.message || 'Failed to add to watchlist', 'error');
    }
  }, [watchlist, addToast, refreshWatchlist]);

  const removeFromWatchlist = useCallback(async (symbol) => {
    // Optimistic update
    const prevWatchlist = [...watchlist];
    setWatchlist(prev => prev.filter(item => item.asset_symbol !== symbol));

    try {
      await apiFetch(`/api/watchlist/${symbol}`, { method: 'DELETE' });
      addToast('Removed from watchlist', 'info');
    } catch (err) {
      // Rollback
      setWatchlist(prevWatchlist);
      addToast(err.message || 'Failed to remove from watchlist', 'error');
    }
  }, [watchlist, addToast]);

  const toggleWatchlist = useCallback(async (symbol) => {
    if (isInWatchlist(symbol)) {
      await removeFromWatchlist(symbol);
    } else {
      await addToWatchlist(symbol);
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      loading,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      refreshWatchlist,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
