import { supabase } from '../lib/supabase';
import type { DbProfile, DbProfileUpdate } from '../lib/database.types';

/**
 * Fetch a user's profile by their auth user_id.
 */
export async function getProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
}

/**
 * Update fields on the current user's profile.
 */
export async function updateProfile(
  userId: string,
  updates: DbProfileUpdate
): Promise<DbProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}

/**
 * Upsert a profile row (used during signup if the trigger hasn't fired yet).
 */
export async function upsertProfile(
  userId: string,
  fullName: string,
  email: string
): Promise<void> {
  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      full_name: fullName,
      email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }
}
