import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiHeart, FiUser, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TABS = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Watchlist',  path: '/watchlist',  icon: FiHeart },
  { name: 'Profile',    path: '/profile',    icon: FiUser },
  { name: 'About',      path: '/about',      icon: FiInfo },
];

const BottomTabBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/asset/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-1/90 backdrop-blur-xl border-t border-line safe-bottom">
      <div className="flex items-center justify-around h-16">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-accent' : 'text-txt-muted'}`} />
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-accent' : 'text-txt-muted'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
