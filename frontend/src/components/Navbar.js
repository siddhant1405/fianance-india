import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp, FiGrid, FiHeart, FiInfo, FiSun, FiMoon,
  FiUser, FiLogOut, FiChevronDown,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Watchlist',  path: '/watchlist',  icon: FiHeart },
  { name: 'About',      path: '/about',      icon: FiInfo },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/asset/');
    }
    return location.pathname === path;
  };

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="hidden md:block fixed top-0 w-full z-50 bg-surface-0/80 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-gain flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/30 transition-shadow">
                <FiTrendingUp className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-txt-primary tracking-tight">
                Finance India
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'text-accent'
                        : 'text-txt-muted hover:text-txt-primary hover:bg-surface-2'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-accent/8 rounded-xl border border-accent/15"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Theme toggle + User dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-surface-2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-2 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-txt-secondary hidden lg:block">
                  {user.name}
                </span>
                <FiChevronDown className={`w-3.5 h-3.5 text-txt-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-surface-1 border border-line rounded-xl shadow-elevated overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-sm font-medium text-txt-primary truncate">{user.name}</p>
                      <p className="text-xs text-txt-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-txt-secondary hover:text-txt-primary hover:bg-surface-2 transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-loss/80 hover:text-loss hover:bg-loss/5 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
