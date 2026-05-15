import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center flex-grow min-h-[85vh] text-center overflow-hidden grid-bg">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 z-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
          Live Exchange Rates
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-7xl font-extrabold text-text-primary mb-6 z-10 tracking-tight"
      >
        <TypeAnimation
          sequence={['Currency Hub', 2000, 'Forex Analytics', 2000, 'Market Insights', 2000]}
          wrapper="span"
          cursor={true}
          speed={30}
          repeat={Infinity}
          style={{ display: 'inline-block' }}
        />
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-lg md:text-xl text-text-secondary font-normal mb-10 z-10 max-w-2xl leading-relaxed"
      >
        Professional-grade forex dashboard with time-series analysis, 
        statistical indicators, and real-time global market tracking.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="z-10 flex items-center gap-4"
      >
        <Link
          to="/convert"
          className="px-8 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl text-base font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5 border border-accent/30"
        >
          Open Dashboard
        </Link>
        <Link
          to="/about"
          className="px-8 py-3 bg-bg-elevated hover:bg-bg-hover text-text-secondary hover:text-text-primary rounded-xl text-base font-medium border border-border transition-all duration-300"
        >
          Learn More
        </Link>
      </motion.div>
    </section>
  );
}
