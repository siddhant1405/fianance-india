import React from "react";
import FlagDropdown from "./FlagDropdown";
import { FaExchangeAlt } from "react-icons/fa";

export default function ConvertCard({
  amount,
  fromCurrency,
  toCurrency,
  convertedAmount,
  conversionRate,
  loading,
  error,
  setAmount,
  setFromCurrency,
  setToCurrency
}) {
  return (
    <div className="glass-card rounded-2xl p-8 shadow-card animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Currency Converter</h2>
          <p className="text-sm text-text-muted mt-0.5">Real-time exchange rates via FastAPI</p>
        </div>
        {conversionRate && (
          <div className="text-right">
            <span className="text-xs text-text-muted block">Exchange Rate</span>
            <span className="font-mono text-sm font-semibold text-accent">1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}</span>
          </div>
        )}
      </div>

      {/* Input Row */}
      <div className="flex flex-col gap-6">
        {/* From Section */}
        <div className="bg-bg-input rounded-xl p-5 border border-border hover:border-border-hover transition-colors">
          <label className="block text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">You Send</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent text-3xl font-bold text-text-primary focus:outline-none placeholder:text-text-muted font-mono"
                min="0"
                placeholder="0.00"
              />
            </div>
            <div className="w-48 flex-shrink-0">
              <FlagDropdown value={fromCurrency} onChange={setFromCurrency} />
            </div>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={() => {
              const temp = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(temp);
            }}
            className="w-10 h-10 rounded-full bg-bg-elevated border border-border hover:border-accent hover:bg-accent/10 flex items-center justify-center transition-all duration-200 hover:rotate-180 group"
          >
            <FaExchangeAlt className="text-text-muted group-hover:text-accent text-sm rotate-90" />
          </button>
        </div>

        {/* To Section */}
        <div className="bg-bg-input rounded-xl p-5 border border-border hover:border-border-hover transition-colors">
          <label className="block text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">You Receive</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              {loading ? (
                <div className="h-10 shimmer-loader rounded-lg w-48"></div>
              ) : error ? (
                <p className="text-danger text-sm mt-2">{error}</p>
              ) : (
                <span className="text-3xl font-bold font-mono text-text-primary">
                  {convertedAmount !== null ? convertedAmount.toFixed(2) : "0.00"}
                </span>
              )}
            </div>
            <div className="w-48 flex-shrink-0">
              <FlagDropdown value={toCurrency} onChange={setToCurrency} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
