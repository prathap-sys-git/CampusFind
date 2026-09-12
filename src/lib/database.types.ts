/**
 * TypeScript types auto-generated from the CampusFind Supabase schema.
 * These match the exact table + column names in the database.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          phone: string | null;
          department: string | null;
          student_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          phone?: string | null;
          department?: string | null;
          student_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          phone?: string | null;
          department?: string | null;
          student_id?: string | null;
          updated_at?: string;
        };
      };

      items: {
        Row: {
          id: string;
          user_id: string;
          type: 'lost' | 'found';
          name: string;
          description: string;
          category: string;
          color: string | null;
          brand: string | null;
          location: string;
          location_details: string | null;
          date: string;
          time: string | null;
          additional_details: string | null;
          image_url: string | null;
          status: 'active' | 'claimed' | 'resolved' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'lost' | 'found';
          name: string;
          description: string;
          category: string;
          color?: string | null;
          brand?: string | null;
          location: string;
          location_details?: string | null;
          date: string;
          time?: string | null;
          additional_details?: string | null;
          image_url?: string | null;
          status?: 'active' | 'claimed' | 'resolved' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: 'lost' | 'found';
          name?: string;
          description?: string;
          category?: string;
          color?: string | null;
          brand?: string | null;
          location?: string;
          location_details?: string | null;
          date?: string;
          time?: string | null;
          additional_details?: string | null;
          image_url?: string | null;
          status?: 'active' | 'claimed' | 'resolved' | 'closed';
          updated_at?: string;
        };
      };

      claims: {
        Row: {
          id: string;
          item_id: string;
          claimant_id: string;
          verification_text: string;
          status: 'pending' | 'under_review' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          claimant_id: string;
          verification_text: string;
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          verification_text?: string;
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          updated_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'match' | 'claim' | 'system' | 'info';
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'match' | 'claim' | 'system' | 'info';
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ─── Convenience row types ────────────────────────────────────────────────────
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type DbProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type DbProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type DbItem = Database['public']['Tables']['items']['Row'];
export type DbItemInsert = Database['public']['Tables']['items']['Insert'];
export type DbItemUpdate = Database['public']['Tables']['items']['Update'];

export type DbClaim = Database['public']['Tables']['claims']['Row'];
export type DbClaimInsert = Database['public']['Tables']['claims']['Insert'];

export type DbNotification = Database['public']['Tables']['notifications']['Row'];
