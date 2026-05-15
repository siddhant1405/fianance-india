import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { FaChartLine, FaExchangeAlt, FaGlobeAmericas, FaDownload, FaDatabase, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    icon: <FaExchangeAlt className="text-accent" />,
    title: "Instant Conversion",
    desc: "Convert between 30+ currencies with real-time exchange rates from trusted financial APIs."
  },
  {
    icon: <FaChartLine className="text-success" />,
    title: "Time-Series Analysis",
    desc: "Interactive charts with configurable timeframes from 1 week to 5 years of historical data."
  },
  {
    icon: <FaGlobeAmericas className="text-warning" />,
    title: "Global Performance",
    desc: "Track 7-day and 30-day percentage changes across major world currencies."
  },
  {
    icon: <FaDatabase className="text-purple-400" />,
    title: "Statistical Indicators",
    desc: "Built-in SMA, volatility, high/low analysis powered by custom JavaScript algorithms."
  },
  {
    icon: <FaDownload className="text-cyan-400" />,
    title: "Data Export",
    desc: "Download historical data as CSV or JSON for use in Excel, Python, or any analytics tool."
  },
  {
    icon: <FaShieldAlt className="text-emerald-400" />,
    title: "Free & Open",
    desc: "No credit card required. Built with free APIs and open-source technologies."
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary">
      <Header>
        <Button to="/convert">Dashboard</Button>
        <Button to="/">Home</Button>
      </Header>

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-20 px-6 text-center overflow-hidden grid-bg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
              About the Project
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Professional Forex<br />
              <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">Analytics Dashboard</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Currency Hub is a comprehensive forex analytics platform built to showcase 
              modern web development and data analytics skills. It combines real-time data 
              visualization with statistical analysis tools used by financial professionals.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Key Features</h2>
            <p className="text-text-muted text-center mb-12">Everything you need for forex market analysis</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-6 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-bg-input flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Built With</h2>
            <p className="text-text-muted mb-10">Modern technologies for performance and reliability</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {["React 19", "Chart.js", "Tailwind CSS", "Framer Motion", "Frankfurter API", "ExchangeRate API", "JavaScript ES6+"].map((tech, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-bg-elevated border border-border text-sm font-medium text-text-secondary hover:text-accent hover:border-accent/30 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
