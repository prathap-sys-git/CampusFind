import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FilterX, RefreshCw, AlertCircle } from 'lucide-react';
import { useItems } from '../../hooks/useItems';
import { ItemCard } from '../../components/ui/ItemCard';
import { SearchBar } from '../../components/browse/SearchBar';
import { FilterBar, type FilterState } from '../../components/browse/FilterBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/LoadingState';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { ItemType } from '../../types';

export interface BrowseItemsPageProps {
  type: ItemType;
}

const INITIAL_FILTERS: FilterState = {
  category: 'all',
  location: 'all',
  dateRange: 'all',
  status: 'all',
  sortBy: 'newest',
};

export const BrowseItemsPage: React.FC<BrowseItemsPageProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const isLost = type === 'lost';

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Derive Supabase-compatible filter params from local state
  const supabaseFilters = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      location: filters.location !== 'all' ? filters.location : undefined,
      dateRange: filters.dateRange !== 'all' ? (filters.dateRange as 'today' | '3days' | 'week') : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      sortBy: filters.sortBy as 'newest' | 'oldest',
      limit: 100,
    }),
    [searchQuery, filters]
  );

  const { items, isLoading, error, refetch } = useItems(type, supabaseFilters);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.status !== 'all' ||
    filters.sortBy !== 'newest';

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters(INITIAL_FILTERS);
    toast({ title: 'Filters Reset', description: 'Showing all items.', type: 'info' });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Campus Intake Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isLost ? 'Lost Items' : 'Found Items'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {isLost
            ? 'Browse items reported missing around campus.'
            : 'Browse items found around campus and help return them to their owners.'}
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={
          isLost
            ? 'Search by item name, description, or category...'
            : 'Search found belongings by title, location, or traits...'
        }
      />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <LoadingState message="Fetching campus records…" />
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Failed to load items</p>
              <p className="text-xs mt-0.5 text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{items.length}</strong>{' '}
              {items.length === 1 ? 'item' : 'items'}
            </span>
            {hasActiveFilters && (
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                Filtered results
              </span>
            )}
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onViewDetails={() => navigate(`/items/${item.id}`)}
                  onRequestClaim={() => navigate(`/items/${item.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FilterX className="w-8 h-8 text-slate-400" />}
              title="No items found"
              description={
                hasActiveFilters
                  ? 'Try changing your search or filters.'
                  : 'No items have been reported yet.'
              }
              actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
              onAction={hasActiveFilters ? handleClearFilters : undefined}
              className="bg-white dark:bg-slate-900"
            />
          )}
        </>
      )}
    </div>
  );
};
