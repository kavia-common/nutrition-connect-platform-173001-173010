import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Chat
 * Placeholder chat page.
 */
export default function Chat() {
  return (
    <div className="container">
      <Card>
        <h2 style={{ marginTop: 0 }}>Chat</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Real-time chat will be available here. Placeholder page.
        </p>
      </Card>
    </div>
  );
}
