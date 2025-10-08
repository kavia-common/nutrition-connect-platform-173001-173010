import React from 'react';
import { Card, Button } from '../../common';

/**
 * PUBLIC_INTERFACE
 * Hydration
 * Simple hydration tracker placeholder.
 */
export default function Hydration() {
  const [glasses, setGlasses] = React.useState(5);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Hydration</strong>
        <Button variant="outline" onClick={() => setGlasses(0)}>Reset</Button>
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        {[...Array(8)].map((_, i) => (
          <button
            key={i}
            aria-label={`Glass ${i + 1}`}
            onClick={() => setGlasses((g) => (i < g ? g - 1 : g + 1))}
            className="btn"
            style={{
              width: 28,
              height: 28,
              padding: 0,
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: i < glasses ? 'var(--color-secondary)' : 'transparent',
              color: i < glasses ? '#111827' : 'var(--color-text-dim)',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div style={{ color: 'var(--color-text-dim)', marginTop: 8 }}>{glasses}/8 glasses</div>
    </Card>
  );
}
