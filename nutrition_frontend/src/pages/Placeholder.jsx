import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * PUBLIC_INTERFACE
 * Placeholder
 * Simple placeholder page to verify routes and theme.
 */
export default function Placeholder({ title = 'Coming Soon', description = 'This page is under construction.' }) {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0 }}>{description}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </Card>
    </div>
  );
}
