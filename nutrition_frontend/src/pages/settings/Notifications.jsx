import React, { useState } from 'react';
import { Card, Button } from '../../components/common';

/**
 * PUBLIC_INTERFACE
 * Notifications
 * Placeholder for user notification preferences.
 * Displays simple toggles stored in local component state for now.
 */
export default function Notifications() {
  const [prefs, setPrefs] = useState({
    email_updates: true,
    push_messages: false,
    weekly_summary: true,
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ error: null, success: false });

  function toggle(name) {
    setPrefs((p) => ({ ...p, [name]: !p[name] }));
  }

  async function save() {
    setSaving(true);
    setStatus({ error: null, success: false });
    try {
      // In future: wire to supabase.settings table using upsertSettings
      await new Promise((r) => setTimeout(r, 400));
      setStatus({ error: null, success: true });
      setTimeout(() => setStatus({ error: null, success: false }), 1500);
    } catch (e) {
      setStatus({ error: e.message || 'Failed to save', success: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container" data-testid="settings-notifications-page">
      <Card>
        <h2 style={{ marginTop: 0 }}>Notifications</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 6 }}>
          Choose how you want to be notified. Placeholder preferences (local state).
        </p>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div role="group" aria-labelledby="notif-group-title" style={{ display: 'grid', gap: 12 }}>
          <div id="notif-group-title" style={{ fontWeight: 700, marginBottom: 4 }}>Preferences</div>
          <label className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
            <input
              type="checkbox"
              checked={prefs.email_updates}
              onChange={() => toggle('email_updates')}
              aria-label="Email updates"
            />
            <span>Email updates</span>
          </label>
          <label className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
            <input
              type="checkbox"
              checked={prefs.push_messages}
              onChange={() => toggle('push_messages')}
              aria-label="Push messages"
            />
            <span>Push messages</span>
          </label>
          <label className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
            <input
              type="checkbox"
              checked={prefs.weekly_summary}
              onChange={() => toggle('weekly_summary')}
              aria-label="Weekly summary"
            />
            <span>Weekly summary</span>
          </label>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant="primary" onClick={save} loading={saving} aria-label="Save notification preferences">
              Save
            </Button>
            {status.error && <span role="alert" style={{ color: 'var(--color-error)' }}>{status.error}</span>}
            {status.success && <span role="status" style={{ color: 'var(--color-secondary)' }}>Saved</span>}
          </div>
        </div>
      </Card>
    </div>
  );
}
