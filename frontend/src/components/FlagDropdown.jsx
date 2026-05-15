import React, { useState, useRef, useEffect } from "react";
import Flags from "country-flag-icons/react/3x2";
import currencyCountryMap from "../utils/currencyCountryMap";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const currencyCodes = Object.keys(currencyCountryMap);

export default function FlagDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const selected = currencyCountryMap[value];
  const SelectedFlag = selected?.countryCode ? Flags[selected.countryCode] : null;

  const filtered = currencyCodes.filter(code => {
    const { name } = currencyCountryMap[code];
    return code.toLowerCase().includes(search.toLowerCase()) || 
           name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className={`w-full bg-bg-input border rounded-lg px-4 py-3 flex items-center text-text-primary focus:outline-none transition-all duration-200 ${
          open ? 'border-accent ring-1 ring-accent/20' : 'border-border hover:border-border-hover'
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center flex-1 min-w-0">
          {SelectedFlag ? (
            <SelectedFlag className="w-6 h-4 mr-3 rounded-sm flex-shrink-0" />
          ) : (
            <span className="inline-block w-6 h-4 bg-bg-hover rounded mr-3 flex-shrink-0" />
          )}
          <span className="truncate flex-1 text-left">
            <span className="font-semibold text-sm">{value}</span>
            <span className="text-text-muted font-normal hidden md:inline ml-2 text-xs">{selected?.name}</span>
          </span>
        </span>
        <FaChevronDown className={`ml-2 text-text-muted text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute z-50 bg-bg-card border border-border rounded-xl mt-2 w-full shadow-elevated overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search currency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bg-input border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          
          <ul className="max-h-52 overflow-y-auto">
            {filtered.map((code) => {
              const { name, countryCode } = currencyCountryMap[code];
              const FlagIcon = countryCode ? Flags[countryCode] : null;
              const isSelected = code === value;
              return (
                <li
                  key={code}
                  className={`px-4 py-2.5 flex items-center cursor-pointer transition-colors ${
                    isSelected ? 'bg-accent/10 text-accent' : 'hover:bg-bg-hover text-text-primary'
                  }`}
                  onClick={() => {
                    onChange(code);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {FlagIcon ? (
                    <FlagIcon className="w-5 h-3.5 mr-3 rounded-sm flex-shrink-0" />
                  ) : (
                    <span className="inline-block w-5 h-3.5 bg-bg-hover rounded mr-3 flex-shrink-0" />
                  )}
                  <span className="truncate flex-1 text-sm">
                    <span className="font-semibold">{code}</span>
                    <span className="text-text-muted ml-2 text-xs">{name}</span>
                  </span>
                  {isSelected && <span className="text-accent text-xs ml-2">✓</span>}
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-text-muted text-sm">No currencies found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
