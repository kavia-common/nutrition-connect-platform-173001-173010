import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthContext
 * Provides authenticated user session and loading flag across the app.
 */
const AuthContext = createContext({
  user: null,
  loading: true,
});

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access AuthContext values.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Initializes Supabase auth session and subscribes to auth state changes.
 * Exposes { user, loading } to children.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    let isMounted = true;

    async function initSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!isMounted) return;
        setUser(data?.session?.user || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth init error:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
