import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Plans
 * Placeholder plans page.
 */
export default function Plans() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Plans</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Manage and view nutrition/workout plans. Placeholder page.
        </p>
      </Card>
    </div>
  );
}
