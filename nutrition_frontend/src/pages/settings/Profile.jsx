import React, { useEffect, useState } from 'react';
import { Card, Input, Button, Loader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { upsertProfile } from '../../lib/supabaseServices';

/**
 * PUBLIC_INTERFACE
 * Profile
 * Basic account profile editing: display name and avatar URL.
 * Integrates with Supabase profiles table via upsertProfile.
 */
export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', avatar_url: '' });
  const [state, setState] = useState({ loading: false, error: null, success: false });

  useEffect(() => {
    setForm({
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
    });
  }, [profile?.full_name, profile?.avatar_url]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!user?.id) return;
    setState({ loading: true, error: null, success: false });
    const { error } = await upsertProfile(user.id, {
      full_name: form.full_name,
      avatar_url: form.avatar_url,
    });
    if (error) {
      setState({ loading: false, error: error.message || 'Failed to update profile', success: false });
      return;
    }
    await refreshProfile?.();
    setState({ loading: false, error: null, success: true });
    setTimeout(() => setState((s) => ({ ...s, success: false })), 2000);
  }

  if (!user) {
    return (
      <div className="container">
        <Card>Sign in required.</Card>
      </div>
    );
  }

  return (
    <div className="container" data-testid="settings-profile-page">
      <Card>
        <h2 style={{ marginTop: 0 }}>Profile</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 6 }}>
          Update your display information. Changes are saved to your Supabase profile.
        </p>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <form onSubmit={onSubmit} aria-label="Profile form">
          <div style={{ display: 'grid', gap: 12 }}>
            <Input
              label="Display Name"
              placeholder="Your name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            />
            <Input
              label="Avatar URL"
              placeholder="https://example.com/avatar.png"
              value={form.avatar_url}
              onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button type="submit" variant="primary" loading={state.loading} aria-label="Save profile">
                Save
              </Button>
              {state.loading && <Loader size="sm" aria-label="Saving" />}
              {state.error && (
                <span
                  role="alert"
                  style={{ color: 'var(--color-error)' }}
                  data-testid="settings-profile-error"
                >
                  {state.error}
                </span>
              )}
              {state.success && (
                <span
                  role="status"
                  style={{ color: 'var(--color-secondary)' }}
                  data-testid="settings-profile-success"
                >
                  Saved
                </span>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
