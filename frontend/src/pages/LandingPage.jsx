import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../utils/api';
import {
  FiTrendingUp, FiTrendingDown, FiArrowRight, FiBarChart2,
  FiCpu, FiFileText, FiLayers, FiSun, FiMoon,
} from 'react-icons/fi';

const FEATURES = [
  {
    icon: FiLayers,
    title: 'Multi-Asset Coverage',
    desc: 'Track Indian stocks, indices, forex pairs, and commodities — all in one place.',
    color: 'text-blue-400 bg-blue-500/10',
  },
  {
    icon: FiBarChart2,
    title: 'Technical Indicators',
    desc: 'SMA, EMA, RSI, MACD, Bollinger Bands computed on real historical data.',
    color: 'text-gain bg-gain/10',
  },
  {
    icon: FiCpu,
    title: 'AI-Powered Insights',
    desc: 'Groq-generated market commentary grounded in your actual indicator readings.',
    color: 'text-ai bg-ai/10',
  },
  {
    icon: FiFileText,
    title: 'Daily PDF Reports',
    desc: 'Scheduled watchlist reports delivered to your inbox with charts and analysis.',
    color: 'text-warning bg-warning/10',
  },
];

const STEPS = [
  { step: '01', title: 'Sign Up', desc: 'Create your free account in seconds.' },
  { step: '02', title: 'Build Your Watchlist', desc: 'Add the assets you care about.' },
  { step: '03', title: 'Get Intelligence', desc: 'Charts, AI insights, and daily reports.' },
];

const LandingPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const data = await apiFetch('/api/market/overview');
        setTickerData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTicker();
  }, []);

  const SYMBOL_LABELS = {
    '^NSEI': 'Nifty 50', '^BSESN': 'Sensex', 'USDINR=X': 'USD/INR', 'GC=F': 'Gold',
  };

  return (
    <div className="min-h-screen bg-surface-0 text-txt-primary">
      {/* ── Sticky Nav ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-line">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-gain flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">FinPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-surface-2 transition-colors"
            >
              {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-txt-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-ai/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-8">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              AI-Powered Financial Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Your markets.{' '}
            <span className="bg-gradient-to-r from-accent to-gain bg-clip-text text-transparent">
              Smarter insights.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-txt-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Track Indian stocks, indices, forex, and commodities with technical indicators,
            AI-generated analysis, and daily PDF reports — all in one dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/register"
              className="px-7 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl shadow-glow hover:shadow-glow-lg transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-7 py-3 bg-surface-2 hover:bg-surface-3 text-txt-secondary hover:text-txt-primary text-sm font-medium rounded-xl border border-line transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Live ticker strip */}
          {tickerData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 flex-wrap"
            >
              {tickerData.map(item => {
                const isPos = item.change_percent >= 0;
                return (
                  <div key={item.symbol} className="flex items-center gap-2 px-4 py-2 bg-surface-1 border border-line rounded-xl">
                    <span className="text-xs font-medium text-txt-muted">{SYMBOL_LABELS[item.symbol] || item.symbol}</span>
                    <span className="text-sm font-semibold font-mono-num text-txt-primary">
                      {item.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${isPos ? 'text-gain' : 'text-loss'}`}>
                      {isPos ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                      {isPos ? '+' : ''}{item.change_percent?.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything you need</h2>
            <p className="text-txt-muted text-sm max-w-lg mx-auto">
              Professional-grade tools for tracking and understanding the Indian financial markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-1 border border-line rounded-2xl p-6 hover:border-line-hover hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-txt-primary mb-1.5">{f.title}</h3>
                  <p className="text-xs text-txt-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How it works</h2>
            <p className="text-txt-muted text-sm">Three steps to smarter market intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-3xl font-black text-accent/20 mb-3">{s.step}</div>
                <h3 className="text-base font-semibold text-txt-primary mb-2">{s.title}</h3>
                <p className="text-sm text-txt-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-txt-muted text-sm mb-8">
            Join FinPulse to track your markets with AI-powered insights — completely free.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl shadow-glow transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Create Free Account <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-line py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-txt-muted">
            &copy; {new Date().getFullYear()} FinPulse &middot; AI-powered financial intelligence
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-xs text-txt-muted hover:text-txt-secondary transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
