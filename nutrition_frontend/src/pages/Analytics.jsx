import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Analytics
 * Placeholder analytics page, typically for coaches/admins.
 */
export default function Analytics() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Analytics</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Insights and analytics will be shown here. Placeholder page.
        </p>
      </Card>
    </div>
  );
}
