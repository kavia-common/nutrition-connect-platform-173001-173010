import React from 'react';
import { Card, Button, Loader } from '../../common';

/**
 * PUBLIC_INTERFACE
 * TodayWorkout
 * Placeholder widget summarizing today's workout.
 */
export default function TodayWorkout() {
  const [loading] = React.useState(false);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Today’s Workout</strong>
        <Button variant="outline">Open</Button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Loader />
        </div>
      ) : (
        <div style={{ marginTop: 8, color: 'var(--color-text-dim)' }}>
          <div style={{ marginBottom: 8 }}>Focus: Full Body • Est. 45 min</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button>Start</Button>
            <Button variant="outline">View Plan</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
