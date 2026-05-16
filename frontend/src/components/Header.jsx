// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO.jpg';

export default function Header({ children }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src={logo} alt="Currency Hub" className="h-9 w-9 rounded-lg ring-1 ring-border group-hover:ring-accent transition-all duration-300" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-bg"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text-primary tracking-tight leading-tight">Currency Hub</span>
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Currency Analytics</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          {children}
        </nav>
      </div>
    </header>
  );
}
