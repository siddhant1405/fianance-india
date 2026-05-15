// src/components/Button.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function GradientButton({ children, to, variant = "default", className = "", ...props }) {
  const location = useLocation();
  const isActive = to && location.pathname === to;

  const variants = {
    default: isActive
      ? "bg-accent/15 text-accent border border-accent/30"
      : "text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-transparent",
    primary: "bg-accent hover:bg-accent-hover text-white shadow-glow hover:shadow-glow-lg border border-accent/30",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-transparent",
  };

  const baseClasses = `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
