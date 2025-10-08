import React from 'react';
import { Card, Button } from '../../components/common';

/**
 * PUBLIC_INTERFACE
 * Billing
 * Placeholder for subscription and billing management. Integrate with Stripe in future.
 */
export default function Billing() {
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
    </div>
  );
}
