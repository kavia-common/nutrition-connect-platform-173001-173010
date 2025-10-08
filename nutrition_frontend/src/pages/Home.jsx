import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Home
 * Public landing placeholder.
 */
export default function Home() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Welcome</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          This is the public landing page. Please sign in to continue.
        </p>
      </Card>
    </div>
  );
}
