import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';
import { getOrCreateProfile as svcGetOrCreateProfile } from '../lib/supabaseServices';
import { ensureAdminOnFirstLogin } from '../lib/supabaseProfiles';

/**
 * PUBLIC_INTERFACE
 * AuthContext
 * Provides authenticated user session, profile (role), and auth actions across the app.
 */
const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  // methods (populated by provider)
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  sendMagicLink: async () => ({ data: null, error: null }),
  resetPassword: async () => ({ data: null, error: null }),
  refreshProfile: async () => ({ profile: null, error: null }),
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
 * Fetches the user profile from 'profiles' table for the given user id.
 * Returns { profile, error }
 */
async function fetchUserProfile(supabase, userId) {
  try {
    if (!userId) return { profile: null, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, onboarding_complete, email, full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    if (error) return { profile: null, error };
    return { profile: data, error: null };
  } catch (e) {
    return { profile: null, error: e };
  }
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Initializes Supabase auth session and subscribes to auth state changes.
 * Exposes { user, profile, loading, signIn, signUp, signOut, sendMagicLink, resetPassword } to children.
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session and profile
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const sessionUser = data?.session?.user || null;
        if (!isMounted) return;

        setUser(sessionUser);

        if (sessionUser?.id) {
          // Dev-only admin ensure
          try {
            if (process.env.NODE_ENV !== 'production' && Array.isArray(window.__DEV_ADMIN_EMAILS)) {
              await ensureAdminOnFirstLogin({ user: sessionUser }, window.__DEV_ADMIN_EMAILS);
            }
          } catch (e) {
            // swallow dev-only errors
          }

          let { profile: p } = await fetchUserProfile(supabase, sessionUser.id);
          // If profile missing, try to create a default shell
          if (!p) {
            const { data: created } = await svcGetOrCreateProfile(sessionUser.id, {});
            p = created || null;
          }
          if (isMounted) setProfile(p);
        } else {
          if (isMounted) setProfile(null);
        }
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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sUser = session?.user || null;
      setUser(sUser);

      if (sUser?.id) {
        // Dev-only admin ensure
        try {
          if (process.env.NODE_ENV !== 'production' && Array.isArray(window.__DEV_ADMIN_EMAILS)) {
            await ensureAdminOnFirstLogin({ user: sUser }, window.__DEV_ADMIN_EMAILS);
          }
        } catch (e) {
          // swallow dev-only errors
        }

        let { profile: p } = await fetchUserProfile(supabase, sUser.id);
        if (!p) {
          const { data: created } = await svcGetOrCreateProfile(sUser.id, {});
          p = created || null;
        }
        setProfile(p);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [supabase]);

  // Auth action methods

  // PUBLIC_INTERFACE
  async function signIn({ email, password }) {
    /**
     * Sign in with email/password using Supabase.
     * Returns { data, error }
     */
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }

  // PUBLIC_INTERFACE
  async function signUp({ email, password, options = {} }) {
    /**
     * Sign up with email/password using Supabase.
     * Returns { data, error }
     * emailRedirectTo should be set by caller; will fallback to window.location.origin if not provided.
     */
    try {
      const { default: getURLDefault, getURL } = await import('../utils/getURL');
      const resolvedGetURL = typeof getURL === 'function' ? getURL : (typeof getURLDefault === 'function' ? getURLDefault : (p) => (window?.location ? `${window.location.origin}${p || ''}` : `http://localhost:3000${p || ''}`));
      const emailRedirectTo =
        options.emailRedirectTo || resolvedGetURL('/auth/callback');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo, data: options.data },
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    /**
     * Sign out the current user and clear local profile.
     */
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setProfile(null);
      }
      return { error };
    } catch (e) {
      return { error: e };
    }
  }

  // PUBLIC_INTERFACE
  async function sendMagicLink({ email, options = {} }) {
    /**
     * Send a magic link login email.
     * Returns { data, error }
     */
    try {
      const { default: getURL } = await import('../utils/getURL');
      const emailRedirectTo =
        options.emailRedirectTo || getURL('/auth/callback');
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo, shouldCreateUser: true },
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }

  // PUBLIC_INTERFACE
  async function resetPassword({ email }) {
    /**
     * Sends password reset email.
     * Returns { data, error }
     */
    try {
      const { default: getURLDefault, getURL } = await import('../utils/getURL');
      const resolvedGetURL = typeof getURL === 'function' ? getURL : (typeof getURLDefault === 'function' ? getURLDefault : (p) => (window?.location ? `${window.location.origin}${p || ''}` : `http://localhost:3000${p || ''}`));
      const redirectTo = resolvedGetURL('/auth/callback');
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }

  // PUBLIC_INTERFACE
  async function refreshProfile() {
    try {
      if (!user?.id) return { profile: null, error: null };
      let { profile: p, error } = await fetchUserProfile(supabase, user.id);
      if (!p && !error) {
        const { data: created } = await svcGetOrCreateProfile(user.id, {});
        p = created || null;
      }
      setProfile(p);
      return { profile: p, error: null };
    } catch (e) {
      return { profile: null, error: e };
    }
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      sendMagicLink,
      resetPassword,
      refreshProfile,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
