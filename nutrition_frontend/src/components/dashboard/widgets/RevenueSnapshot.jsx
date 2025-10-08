import React from 'react';
import { Card } from '../../common';

/**
 * PUBLIC_INTERFACE
 * RevenueSnapshot
 * Displays a simple revenue summary placeholder for administrators.
 */
export default function RevenueSnapshot() {
  return (
    <Card>
      <strong>Revenue Snapshot</strong>
      <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
        <div className="card" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>MRR</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>$18,450</div>
        </div>
        <div className="card" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>ARPU</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>$42.10</div>
        </div>
        <div className="card" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Growth</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-secondary)' }}>+6.2% MoM</div>
        </div>
      </div>
    </Card>
  );
}
