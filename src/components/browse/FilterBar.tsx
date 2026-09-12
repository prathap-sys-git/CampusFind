import React, { useState } from 'react';
import { Filter, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { REPORT_CATEGORIES, CAMPUS_LOCATION_OPTIONS } from '../../data/mockData';

export interface FilterState {
  category: string;
  location: string;
  dateRange: string;
  status: string;
  sortBy: 'newest' | 'oldest';
}

export interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
  className = '',
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...REPORT_CATEGORIES.filter((c) => c.value !== ''),
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...CAMPUS_LOCATION_OPTIONS.filter((l) => l.value !== ''),
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '3days', label: 'Past 3 Days' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'matched', label: 'AI Matched' },
    { value: 'claimed', label: 'Claimed' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
  ];

  const handleChangeField = (field: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div
      className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 ${className}`}
    >
      {/* Top Bar: Title, Mobile Toggle, and Clear Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Filters & Sorting
          </span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-blue-600" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Clear Filters
            </Button>
          )}

          {/* Mobile Collapse Button */}
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{mobileExpanded ? 'Hide' : 'Refine'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Select Controls Grid */}
      <div
        className={`${
          mobileExpanded ? 'grid' : 'hidden'
        } md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800`}
      >
        {/* Category */}
        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => handleChangeField('category', e.target.value)}
          options={categoryOptions}
        />

        {/* Location */}
        <Select
          label="Location"
          value={filters.location}
          onChange={(e) => handleChangeField('location', e.target.value)}
          options={locationOptions}
        />

        {/* Date Interval */}
        <Select
          label="Date"
          value={filters.dateRange}
          onChange={(e) => handleChangeField('dateRange', e.target.value)}
          options={dateOptions}
        />

        {/* Status */}
        <Select
          label="Status"
          value={filters.status}
          onChange={(e) => handleChangeField('status', e.target.value)}
          options={statusOptions}
        />

        {/* Sort */}
        <Select
          label="Sort Order"
          value={filters.sortBy}
          onChange={(e) => handleChangeField('sortBy', e.target.value as 'newest' | 'oldest')}
          options={sortOptions}
        />
      </div>
    </div>
  );
};
