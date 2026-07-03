import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCheckCircle, FiCpu, FiGithub } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-gain flex items-center justify-center mx-auto mb-6 shadow-glow">
          <FiTrendingUp className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-txt-primary mb-3">About Finance India</h1>
        <p className="text-txt-secondary text-lg max-w-xl mx-auto">
          Intelligent market tracking and analysis for the modern Indian investor.
        </p>
      </motion.div>

      {/* Philosophy */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-1 border border-line rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-txt-primary">Our Philosophy</h2>
        <p className="text-sm text-txt-secondary leading-relaxed">
          Finance India was built with a single goal: to cut through the noise of financial markets. 
          By combining real-time data, established technical indicators, and deterministic AI analysis, 
          we provide clear, actionable insights without the typical clutter of traditional trading terminals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="w-5 h-5 text-gain shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-txt-primary">Clean Design</h4>
              <p className="text-xs text-txt-muted mt-1">Focus on what matters. No flashing banners or overwhelming tables.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiCheckCircle className="w-5 h-5 text-gain shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-txt-primary">Data-Driven</h4>
              <p className="text-xs text-txt-muted mt-1">All insights are grounded in hard mathematical indicators.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* AI Grounding */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-1 border border-line rounded-2xl p-8 ai-border relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-ai/5 rounded-full blur-[50px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-ai/10 flex items-center justify-center">
            <FiCpu className="w-5 h-5 text-ai" />
          </div>
          <h2 className="text-xl font-bold text-txt-primary">How our AI works</h2>
        </div>
        <p className="text-sm text-txt-secondary leading-relaxed relative z-10">
          Our AI insights are powered by Groq's high-speed inference. Crucially, the AI is <strong className="text-txt-primary">strictly grounded</strong>. 
          It does not hallucinate price targets or make random guesses. Before generating an insight, the backend computes the RSI, MACD, and Moving Averages, 
          and feeds these exact numbers into the prompt. The resulting analysis is a direct interpretation of these technicals.
        </p>
      </motion.section>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center flex flex-col items-center gap-4">
        <p className="text-sm text-txt-muted">Built with React, Tailwind, Chart.js, and FastAPI.</p>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-line rounded-xl text-sm font-medium text-txt-primary transition-colors">
          <FiGithub className="w-4 h-4" /> View Source
        </a>
      </motion.div>

    </div>
  );
};

export default AboutPage;
