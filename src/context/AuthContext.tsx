/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { DbProfile } from '../lib/database.types';
import {
  signIn,
  signUp,
  signOut as authSignOut,
  getAuthErrorMessage,
} from '../services/authService';
import { getProfile, upsertProfile } from '../services/profileService';

// ─── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextType {
  /** Supabase Auth session (null if not logged in) */
  session: Session | null;
  /** Raw Supabase Auth user */
  supabaseUser: User | null;
  /** Full profile row from the profiles table */
  profile: DbProfile | null;
  /** True once the initial session check has completed */
  isLoading: boolean;
  /** True when the user has an active session */
  isAuthenticated: boolean;
  /** Login — throws a user-friendly error string on failure */
  login: (email: string, password: string) => Promise<void>;
  /** Register — throws a user-friendly error string on failure */
  register: (fullName: string, email: string, password: string) => Promise<void>;
  /** Logout */
  logout: () => Promise<void>;
  /** Refresh the local profile after an external update */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load profile for a given user ID ────────────────────────────────────────
  const loadProfile = async (userId: string) => {
    try {
      const p = await getProfile(userId);
      setProfile(p);
    } catch {
      // Profile might not exist yet if trigger is slow; that's OK
      setProfile(null);
    }
  };

  // ── Bootstrap: check current session on mount ────────────────────────────────
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const sess = data.session;
      setSession(sess);
      setSupabaseUser(sess?.user ?? null);

      if (sess?.user) {
        loadProfile(sess.user.id).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Subscribe to auth state changes (login, logout, token refresh, cross-tab)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!mounted) return;
      setSession(sess);
      setSupabaseUser(sess?.user ?? null);

      if (sess?.user) {
        loadProfile(sess.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signIn({ email, password });
      if (user) await loadProfile(user.id);
    } catch (err) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const { user } = await signUp({ fullName, email, password });
      // The DB trigger auto-creates the profile, but we upsert as a safety net
      if (user) {
        await upsertProfile(user.id, fullName, email);
        await loadProfile(user.id);
      }
    } catch (err) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  const logout = async () => {
    await authSignOut();
    setSession(null);
    setSupabaseUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (supabaseUser) await loadProfile(supabaseUser.id);
  };

  const isAuthenticated = !!session && !!supabaseUser;

  return (
    <AuthContext.Provider
      value={{
        session,
        supabaseUser,
        profile,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
