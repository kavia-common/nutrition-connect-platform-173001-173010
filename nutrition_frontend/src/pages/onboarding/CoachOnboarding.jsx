import React from 'react';
import Card from '../../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * CoachOnboarding
 * Placeholder coach onboarding page, accessible during onboarding.
 */
export default function CoachOnboarding() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Coach Onboarding</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Set up your coaching profile. Placeholder page.
        </p>
      </Card>
    </div>
  );
}
