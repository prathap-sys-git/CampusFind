import { supabase } from '../lib/supabase';
import type { DbItem, DbItemInsert } from '../lib/database.types';
import { uploadItemImage } from './storageService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItemFilters {
  search?: string;
  category?: string;
  location?: string;
  dateRange?: 'all' | 'today' | '3days' | 'week';
  status?: string;
  sortBy?: 'newest' | 'oldest';
  limit?: number;
}

export interface CreateItemData {
  type: 'lost' | 'found';
  name: string;
  description: string;
  category: string;
  color?: string;
  brand?: string;
  location: string;
  locationDetails?: string;
  date: string;
  time?: string;
  additionalDetails?: string;
}

// ─── Public-safe item shape (hides additional_details from non-owners) ─────────

export type PublicItem = Omit<DbItem, 'additional_details'> & {
  additional_details?: null; // never exposed publicly
};

// ─── Service functions ─────────────────────────────────────────────────────────

/**
 * Create a new item report. Uploads the image to Storage first,
 * then inserts the item row with the resulting public URL.
 */
export async function createItem(
  data: CreateItemData,
  imageFile: File | null,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<DbItem> {
  let imageUrl: string | null = null;

  // 1. Upload image (if provided)
  if (imageFile) {
    onProgress?.(10);
    const uploadResult = await uploadItemImage(imageFile, userId, (p) => {
      onProgress?.(Math.round(10 + p * 0.7)); // 10–80%
    });
    imageUrl = uploadResult.publicUrl;
    onProgress?.(80);
  }

  // 2. Insert item record
  const insert: DbItemInsert = {
    user_id: userId,
    type: data.type,
    name: data.name,
    description: data.description,
    category: data.category,
    color: data.color || null,
    brand: data.brand || null,
    location: data.location,
    location_details: data.locationDetails || null,
    date: data.date,
    time: data.time || null,
    additional_details: data.additionalDetails || null,
    image_url: imageUrl,
    status: 'active',
  };

  const { data: item, error } = await supabase
    .from('items')
    .insert(insert)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save item: ${error.message}`);
  }

  onProgress?.(100);
  return item;
}

/**
 * Fetch items (lost or found) with filters, search, and sorting.
 * Does NOT return additional_details (private field).
 */
export async function fetchItems(
  type: 'lost' | 'found',
  filters: ItemFilters = {}
): Promise<PublicItem[]> {
  const {
    search,
    category,
    location,
    dateRange,
    status = 'active',
    sortBy = 'newest',
    limit = 100,
  } = filters;

  let query = supabase
    .from('items')
    .select(
      'id, user_id, type, name, description, category, color, brand, location, location_details, date, time, image_url, status, created_at, updated_at'
    )
    .eq('type', type);

  // Status filter
  if (status && status !== 'all') {
    query = query.eq('status', status);
  } else if (!status || status === 'all') {
    // Default: show active + claimed (not resolved/closed)
    query = query.in('status', ['active', 'claimed']);
  }

  // Full-text search across name, description
  if (search?.trim()) {
    const q = search.trim();
    query = query.or(
      `name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%,location.ilike.%${q}%`
    );
  }

  // Category filter
  if (category && category !== 'all') {
    query = query.ilike('category', category);
  }

  // Location filter
  if (location && location !== 'all') {
    query = query.ilike('location', `%${location}%`);
  }

  // Date range filter
  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    if (dateRange === 'today') {
      query = query.eq('date', now.toISOString().split('T')[0]);
    } else if (dateRange === '3days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 3);
      query = query.gte('date', d.toISOString().split('T')[0]);
    } else if (dateRange === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      query = query.gte('date', d.toISOString().split('T')[0]);
    }
  }

  // Sorting
  query = query.order('created_at', { ascending: sortBy === 'oldest' });

  // Limit
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch items: ${error.message}`);
  }

  return (data ?? []) as PublicItem[];
}

/**
 * Fetch a single item by ID.
 * Returns the full row for the item's owner, public row for others.
 */
export async function fetchItemById(id: string): Promise<DbItem | null> {
  const { data, error } = await supabase
    .from('items')
    .select(
      'id, user_id, type, name, description, category, color, brand, location, location_details, date, time, image_url, status, created_at, updated_at'
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Failed to fetch item: ${error.message}`);
  }

  return data as DbItem;
}

/**
 * Fetch all items belonging to the current user.
 */
export async function fetchMyItems(userId: string): Promise<DbItem[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch your items: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Map a DbItem to the legacy CampusItem shape used by UI components.
 */
export function mapDbItemToUi(item: DbItem | PublicItem) {
  return {
    id: item.id,
    name: item.name,
    title: item.name,
    description: item.description,
    category: item.category,
    type: item.type as 'lost' | 'found',
    location: item.location,
    locationDetails: item.location_details ?? undefined,
    date: item.date,
    relativeDate: getRelativeDate(item.date),
    time: item.time ?? undefined,
    imageUrl: item.image_url ?? 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    status: mapStatus(item.status),
    color: item.color ?? undefined,
    brand: item.brand ?? undefined,
    tags: [item.category, item.location].filter(Boolean),
    reportedBy: { name: 'Campus Member' },
  };
}

function mapStatus(s: string): 'open' | 'claimed' | 'matched' | 'resolved' {
  if (s === 'active') return 'open';
  if (s === 'claimed') return 'claimed';
  if (s === 'resolved') return 'resolved';
  return 'open';
}

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
}
