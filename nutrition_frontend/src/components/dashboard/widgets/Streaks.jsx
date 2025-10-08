import React from 'react';
import { Card } from '../../common';

/**
 * PUBLIC_INTERFACE
 * Streaks
 * Shows simple compliance/consistency streaks.
 */
export default function Streaks() {
  return (
    <Card>
      <strong>Streaks</strong>
      <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
        {[
          { label: 'Meals Logged', value: 7 },
          { label: 'Workouts Completed', value: 3 },
          { label: 'Hydration', value: 5 },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              background: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              padding: 12,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>{s.value}d</div>
            <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
