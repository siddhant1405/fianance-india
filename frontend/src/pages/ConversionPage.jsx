import React, { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GradientButton from "../components/Button";
import ConvertCard from "../components/ConvertCard";
import TrendsCard from "../components/TrendsCard";
import PerformanceCard from "../components/PerformanceCard";
import { FaExchangeAlt, FaChartLine, FaGlobeAmericas } from "react-icons/fa";
import { getCurrencies, convertCurrency } from "../utils/api";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler);

const tabs = [
  { id: "convert", label: "Converter", icon: <FaExchangeAlt /> },
  { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
  { id: "performance", label: "Global Markets", icon: <FaGlobeAmericas /> },
];

export default function ConversionPage() {
  const [activeTab, setActiveTab] = useState("convert");

  // Conversion
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);

  // Trends
  const [frankfurterCurrencies, setFrankfurterCurrencies] = useState([]);
  const [trendFrom, setTrendFrom] = useState("USD");
  const [trendTo, setTrendTo] = useState("INR");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch currency list from backend
  useEffect(() => {
    getCurrencies()
      .then((currencies) => {
        const codes = Object.keys(currencies);
        setFrankfurterCurrencies(codes);
        if (!codes.includes(trendFrom)) setTrendFrom(codes[0]);
        if (!codes.includes(trendTo)) setTrendTo(codes[1]);
      })
      .catch(() =>
        setFrankfurterCurrencies(["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "CHF"])
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Conversion via backend
  const fetchConversion = useCallback(async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      const result = await convertCurrency(fromCurrency, toCurrency, amount);
      setConvertedAmount(result.converted_amount);
      setConversionRate(result.rate);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to convert currency.");
      setConvertedAmount(null);
      setConversionRate(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    if (activeTab === "convert") {
      fetchConversion();
    }
  }, [activeTab, fetchConversion]);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary">
      <Header>
        <GradientButton to="/">Home</GradientButton>
        <GradientButton to="/about">About</GradientButton>
      </Header>

      <main className="flex-grow w-full">
        {/* Dashboard Header */}
        <div className="border-b border-border bg-bg-card/50">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Forex Dashboard</h1>
                <p className="text-sm text-text-muted mt-1">Real-time analytics, conversion, and global market data</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <span>Backend Connected</span>
                <span className="mx-2 text-border">|</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? "bg-bg-elevated text-accent border-accent"
                      : "text-text-muted hover:text-text-primary border-transparent hover:bg-bg-hover/50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "convert" && (
            <div className="max-w-3xl mx-auto">
              <ConvertCard
                amount={amount}
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                convertedAmount={convertedAmount}
                conversionRate={conversionRate}
                loading={loading}
                error={error}
                setAmount={setAmount}
                setFromCurrency={setFromCurrency}
                setToCurrency={setToCurrency}
              />
              
              {/* Quick info */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Backend", value: "FastAPI", color: "text-accent" },
                  { label: "Currencies", value: "160+", color: "text-success" },
                  { label: "Updates", value: "Daily", color: "text-warning" },
                ].map((item, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 text-center">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest block mb-1">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <TrendsCard
              frankfurterCurrencies={frankfurterCurrencies}
              trendFrom={trendFrom}
              trendTo={trendTo}
              setTrendFrom={setTrendFrom}
              setTrendTo={setTrendTo}
            />
          )}

          {activeTab === "performance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceCard baseCurrency="USD" />
              <PerformanceCard baseCurrency="EUR" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
