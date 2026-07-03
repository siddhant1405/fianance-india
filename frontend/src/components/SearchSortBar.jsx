import React from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'name-asc',     label: 'Name (A-Z)' },
  { value: 'name-desc',    label: 'Name (Z-A)' },
  { value: 'change-desc',  label: '% Change ↓' },
  { value: 'change-asc',   label: '% Change ↑' },
  { value: 'price-desc',   label: 'Price ↓' },
  { value: 'price-asc',    label: 'Price ↑' },
];

const SearchSortBar = ({ searchQuery, onSearchChange, sortBy, onSortChange }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search assets..."
          className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 bg-surface-2 border border-line rounded-xl text-sm text-txt-secondary focus:outline-none focus:border-accent/50 cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-muted pointer-events-none" />
      </div>
    </div>
  );
};

export { SORT_OPTIONS };
export default SearchSortBar;
