import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Dashboard
 * Placeholder dashboard page for authenticated users.
 */
export default function Dashboard() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Dashboard</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Welcome to your dashboard. This is a placeholder.
        </p>
      </Card>
    </div>
  );
}
