import React from 'react';
import Card from '../../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * ClientOnboarding
 * Placeholder client onboarding page, accessible during onboarding.
 */
export default function ClientOnboarding() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Client Onboarding</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Complete your profile to get started. Placeholder page.
        </p>
      </Card>
    </div>
  );
}
