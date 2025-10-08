import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Settings
 * Placeholder settings page.
 */
export default function Settings() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Settings</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Update your account and preferences here. Placeholder page.
        </p>
      </Card>
    </div>
  );
}
