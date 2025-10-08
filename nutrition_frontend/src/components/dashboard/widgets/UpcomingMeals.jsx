import React from 'react';
import { Card, Button, Loader } from '../../common';

/**
 * PUBLIC_INTERFACE
 * UpcomingMeals
 * Placeholder widget listing upcoming meals for the day.
 */
export default function UpcomingMeals() {
  const [loading] = React.useState(false);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Upcoming Meals</strong>
        <Button variant="outline">View All</Button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Loader />
        </div>
      ) : (
        <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
          {/* TODO: Replace with real data from services */}
          {['Breakfast • 8:00 AM', 'Lunch • 12:30 PM', 'Snack • 3:30 PM', 'Dinner • 7:00 PM'].map((m) => (
            <div
              key={m}
              className="card"
              style={{
                background: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
              }}
            >
              <span>{m}</span>
              <Button size="sm">Log</Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
