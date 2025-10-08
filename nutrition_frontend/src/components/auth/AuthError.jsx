import React from 'react';
import Card from '../common/Card';

export default function AuthError() {
  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Authentication Error</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          We couldn't complete the authentication flow. Please ensure the redirect URL is allowlisted in your Supabase Auth settings and try again.
        </p>
      </Card>
    </div>
  );
}
