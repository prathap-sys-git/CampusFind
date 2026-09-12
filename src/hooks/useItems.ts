import { useState, useEffect, useCallback } from 'react';
import { fetchItems, mapDbItemToUi, type ItemFilters } from '../services/itemService';
import type { CampusItem } from '../types';

interface UseItemsResult {
  items: CampusItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch and filter lost or found items from Supabase.
 * Automatically re-fetches when filters change.
 */
export function useItems(
  type: 'lost' | 'found',
  filters: ItemFilters = {}
): UseItemsResult {
  const [items, setItems] = useState<CampusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchItems(type, filters);
        if (!cancelled) {
          setItems(data.map(mapDbItemToUi) as CampusItem[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load items.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, refreshKey, filters.search, filters.category, filters.location, filters.dateRange, filters.status, filters.sortBy]);

  return { items, isLoading, error, refetch };
}
