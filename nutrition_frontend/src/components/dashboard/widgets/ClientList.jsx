import React from 'react';
import { Card, Button, Loader, Avatar, Badge } from '../../common';

/**
 * PUBLIC_INTERFACE
 * ClientList
 * Displays a list of clients for the coach.
 */
export default function ClientList() {
  const [loading] = React.useState(false);
  const clients = [
    { id: '1', name: 'Jane Doe', status: 'online' },
    { id: '2', name: 'Alex Johnson', status: 'busy' },
    { id: '3', name: 'Sam Carter', status: 'offline' },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Clients</strong>
        <Button variant="outline">Manage</Button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Loader />
        </div>
      ) : (
        <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
          {clients.map((c) => (
            <div
              key={c.id}
              className="card"
              style={{
                background: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={c.name} size="sm" status={c.status} />
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Last check-in: —</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge variant={c.status === 'online' ? 'success' : c.status === 'busy' ? 'error' : 'neutral'}>
                  {c.status}
                </Badge>
                <Button size="sm">Open</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
