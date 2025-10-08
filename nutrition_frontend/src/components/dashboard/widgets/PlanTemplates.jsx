import React from 'react';
import { Card, Button } from '../../common';

/**
 * PUBLIC_INTERFACE
 * PlanTemplates
 * Shows a small gallery of plan templates for quick usage.
 */
export default function PlanTemplates() {
  const templates = [
    { id: 't1', name: 'Lean Bulk (12w)' },
    { id: 't2', name: 'Fat Loss (8w)' },
    { id: 't3', name: 'Performance Boost (6w)' },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Plan Templates</strong>
        <Button variant="outline">Browse</Button>
      </div>
      <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        {templates.map((t) => (
          <div
            key={t.id}
            className="card"
            style={{
              background: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontWeight: 700 }}>{t.name}</div>
            <Button size="sm">Use</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
