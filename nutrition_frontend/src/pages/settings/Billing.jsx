import React, { useCallback, useState } from 'react';
import { Card, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { runMinimalDevSeed } from '../../lib/devSeedHelper';

/**
 * PUBLIC_INTERFACE
 * Billing
 * Placeholder for subscription and billing management. Integrate with Stripe in future.
 * Adds a developer-only seeding button in development.
 */
export default function Billing() {
  const { profile } = useAuth() || {};
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSeed = useCallback(async () => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!profile?.id) {
      setMsg('Sign in to run dev seed.');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const res = await runMinimalDevSeed({ id: profile.id, role: profile.role || 'client' });
      setMsg(`Seeded. Plan ${res.planId.slice(0, 8)}…, Conversation ${res.conversationId.slice(0, 8)}…`);
    } catch (e) {
      setMsg(`Seed failed: ${e?.message || 'unknown error'}`);
    } finally {
      setBusy(false);
    }
  }, [profile?.id, profile?.role]);

  return (
    <div className="container" data-testid="settings-billing-page">
      <Card>
        <h2 style={{ marginTop: 0 }}>Billing</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 6 }}>
          Manage your subscription and payment methods. This is a placeholder page.
        </p>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div className="card" style={{ background: 'var(--color-surface-2)', padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Current Plan</div>
          <div style={{ color: 'var(--color-text-dim)' }}>Free</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button variant="primary" aria-label="Upgrade plan">Upgrade</Button>
          <Button variant="outline" aria-label="Manage payment methods">Payment Methods</Button>
        </div>
      </Card>

      {process.env.NODE_ENV === 'development' && (
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button onClick={handleSeed} disabled={busy} variant="outline">
              {busy ? 'Seeding…' : 'Seed Sample Data (Dev)'}
            </Button>
            {msg && <span style={{ color: 'var(--text-secondary)' }}>{msg}</span>}
          </div>
        </Card>
      )}
    </div>
  );
}
