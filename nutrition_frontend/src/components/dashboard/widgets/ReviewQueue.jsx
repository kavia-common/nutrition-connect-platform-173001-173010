import React from 'react';
import { Card, Button } from '../../common';

/**
 * PUBLIC_INTERFACE
 * ReviewQueue
 * Placeholder for items requiring coach review (check-ins, plan updates).
 */
export default function ReviewQueue() {
  const items = [
    { id: 'r1', title: 'Check-in: Jane Doe', detail: 'New weekly check-in submitted' },
    { id: 'r2', title: 'Plan Feedback: Sam Carter', detail: 'Requested adjustments to macros' },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Review Queue</strong>
        <Button variant="outline">View All</Button>
      </div>
      <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        {items.map((it) => (
          <div
            key={it.id}
            className="card"
            style={{
              background: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              padding: 12,
              display: 'grid',
              gap: 6,
            }}
          >
            <div style={{ fontWeight: 700 }}>{it.title}</div>
            <div style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>{it.detail}</div>
            <div>
              <Button size="sm">Open</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
