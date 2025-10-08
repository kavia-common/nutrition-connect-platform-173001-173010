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
  // Allow passing a preferred role from auth screens
  completePostLoginRouting: async () => ({ redirected: false }),
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

  async function applyRoleIfMissing(targetRole) {
    // Ensure we only set role if it's missing
    try {
      if (!user?.id) return;
      const currentRole = profile?.role;
      if (!currentRole && (targetRole === 'coach' || targetRole === 'client')) {
        const { upsertProfile } = await import('../lib/supabaseServices');
        await upsertProfile(user.id, { role: targetRole, onboarding_complete: false });
        await refreshProfile();
      }
    } catch (e) {
      // ignore role apply errors to not block login flow
      // eslint-disable-next-line no-console
      console.warn('applyRoleIfMissing warning:', e?.message || e);
    }
  }

  function routeAfterLogin({ selectedRole }) {
    // Decide destination based on final profile state
    const finalRole = profile?.role || selectedRole || 'client';
    const isCoach = finalRole === 'coach';
    const isClient = finalRole === 'client';

    const done = profile?.onboarding_complete === true;
    if (!done) {
      return isCoach ? '/onboarding/coach' : '/onboarding/client';
    }
    if (isCoach) return '/dashboard/coach';
    if (finalRole === 'admin') return '/dashboard/admin';
    if (isClient) return '/dashboard/client';
    return '/dashboard';
  }

  // PUBLIC_INTERFACE
  async function signIn({ email, password, targetRole }) {
    /**
     * Sign in with email/password using Supabase.
     * Returns { data, error }
     */
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // Try to apply target role in background (if provided)
      if (data?.user && targetRole) {
        // temporary set user state to allow applyRoleIfMissing to work immediately
        setUser((prev) => prev || data.user);
        await applyRoleIfMissing(targetRole);
      }
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }

  // PUBLIC_INTERFACE
  async function signUp({ email, password, options = {}, targetRole }) {
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
      const signupData = { ...(options.data || {}) };
      if (targetRole && !signupData.role) {
        signupData.role = targetRole;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo, data: signupData },
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
  async function completePostLoginRouting({ selectedRole } = {}) {
    /**
     * Ensures role is set (if missing) and returns a path to navigate to based on onboarding/profile state.
     */
    try {
      if (selectedRole) {
        await applyRoleIfMissing(selectedRole);
      }
      // refresh local profile to latest
      await refreshProfile();
      return { redirected: true, path: routeAfterLogin({ selectedRole }) };
    } catch (e) {
      return { redirected: false, path: '/dashboard' };
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
      completePostLoginRouting,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
