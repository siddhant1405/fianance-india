// src/components/Footer.jsx
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-text-muted text-sm">All systems operational</span>
        </div>
        <p className="text-text-muted text-sm">
          &copy; {new Date().getFullYear()} Currency Hub &middot; Powered by Frankfurter & ExchangeRate API
        </p>
        <div className="flex items-center gap-3">
          <span className="text-text-muted text-xs">Data refreshed daily</span>
        </div>
      </div>
    </footer>
  );
}
