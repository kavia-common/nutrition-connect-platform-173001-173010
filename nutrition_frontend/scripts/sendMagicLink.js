#!/usr/bin/env node
/**
 * Dev-only: Send a Supabase magic link and prep admin profile.
 *
 * Usage:
 *   node scripts/sendMagicLink.js --email="nutriekspert@gmail.com" --admin
 *
 * Requires env:
 *   REACT_APP_SUPABASE_URL
 *   REACT_APP_SUPABASE_KEY (service or anon; service preferred for admin seeding)
 *
 * Note: This script is intended for development environments only.
 */

const { createClient } = require('@supabase/supabase-js');

function getArg(name, defaultValue = undefined) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  if (arg) return arg.slice(prefix.length);
  const flag = `--${name}`;
  if (process.argv.includes(flag)) return true;
  return defaultValue;
}

// PUBLIC_INTERFACE
function getURL(path = '/') {
  /** Build a full URL using SITE_URL or default localhost. */
  const siteUrl = process.env.REACT_APP_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${siteUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

(async () => {
  try {
    const email = getArg('email') || process.env.ADMIN_SEED_EMAIL;
    const isAdmin = !!getArg('admin', false);
    if (!email) {
      console.error('Missing --email. Example: node scripts/sendMagicLink.js --email="user@example.com" --admin');
      process.exit(1);
    }

    const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('Missing Supabase env. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY (or service role key) are set.');
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1) Send magic link
    const redirectTo = getURL('/auth/callback');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (signInError) {
      console.error('Failed to send magic link:', signInError.message);
      process.exit(1);
    }
    console.log(`Magic link requested for ${email}. Redirect: ${redirectTo}`);

    // 2) Try to upsert profile if user exists already (service key recommended)
    let userId = null;
    try {
      if (typeof supabase.auth.getUserById === 'function') {
        // No direct ID known; attempt by email via Admin API if available (service role required)
        // Fallback: use auth admin api if exposed in this environment
        if (supabase.auth.admin && typeof supabase.auth.admin.listUsers === 'function') {
          const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
          if (!usersError && usersData && usersData.users) {
            const match = usersData.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
            if (match) userId = match.id;
          }
        }
      } else if (supabase.auth.admin && typeof supabase.auth.admin.listUsers === 'function') {
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        if (!usersError && usersData && usersData.users) {
          const match = usersData.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
          if (match) userId = match.id;
        }
      }
    } catch (e) {
      // Non-fatal; continue with deferred upsert
    }

    if (userId) {
      // Upsert profile immediately
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email,
            role: isAdmin ? 'admin' : 'user',
            onboarding_complete: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      if (upsertError) {
        console.warn('Profile upsert failed (will be handled on first login):', upsertError.message);
      } else {
        console.log(`Profile upserted for userId=${userId} with role=${isAdmin ? 'admin' : 'user'}`);
      }
    } else {
      console.log(
        'User not found yet (likely unconfirmed). A deferred upsert will run on first login via app logic.'
      );
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
