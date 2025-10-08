import React from 'react';
import { Card } from '../../common';

/**
 * PUBLIC_INTERFACE
 * SystemMetrics
 * Displays a simple status overview placeholder for administrators.
 */
export default function SystemMetrics() {
  const metrics = [
    { key: 'API Latency', value: '112ms' },
    { key: 'Websocket Connections', value: '324' },
    { key: 'Error Rate', value: '0.12%' },
    { key: 'Active Users', value: '1,482' },
  ];

  return (
    <Card>
      <strong>System Metrics</strong>
      <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
        {metrics.map((m) => (
          <div
            key={m.key}
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
            <div style={{ color: 'var(--color-text-dim)' }}>{m.key}</div>
            <div style={{ fontWeight: 800 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
