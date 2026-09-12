import { supabase } from '../lib/supabase';
import type { DbClaim, DbClaimInsert } from '../lib/database.types';

/**
 * Submit a new claim for a found item.
 */
export async function createClaim(
  itemId: string,
  claimantId: string,
  verificationText: string
): Promise<DbClaim> {
  const insert: DbClaimInsert = {
    item_id: itemId,
    claimant_id: claimantId,
    verification_text: verificationText,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('claims')
    .insert(insert)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already submitted a claim for this item.');
    }
    throw new Error(`Failed to submit claim: ${error.message}`);
  }

  return data;
}

/**
 * Fetch all claims submitted by the current user.
 */
export async function fetchMyClaims(userId: string): Promise<DbClaim[]> {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('claimant_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch claims: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetch all claims on a specific item (for the item owner).
 */
export async function fetchClaimsForItem(itemId: string): Promise<DbClaim[]> {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('item_id', itemId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch claims for item: ${error.message}`);
  }

  return data ?? [];
}
