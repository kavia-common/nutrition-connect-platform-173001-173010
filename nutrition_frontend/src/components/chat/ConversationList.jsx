import React from 'react';
import { Button, Loader } from '../common';

export default function ConversationList({
  conversations = [],
  loading = false,
  empty = false,
  error = null,
  currentUserId,
  role = 'client',
  onSelect = () => {},
  onStartNew = () => {},
}) {
  return (
    <div style={{ display: 'grid', gap: 8, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Conversations</strong>
        {role === 'coach' && (
          <Button
            variant="outline"
            onClick={() => {
              const target = window.prompt('Enter client user_id to start conversation:');
              if (target) onStartNew(target);
            }}
          >
            New
          </Button>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <Loader />
          </div>
        )}
        {error && <div className="card" style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.35)' }}>{error}</div>}
        {empty && !loading && <div style={{ color: 'var(--color-text-dim)' }}>No conversations yet.</div>}
        {!loading && !empty && (
          <div style={{ display: 'grid', gap: 8 }}>
            {conversations.map((c) => {
              const otherId = c.coach_id === currentUserId ? c.client_id : c.coach_id;
              return (
                <button
                  key={c.id}
                  className="btn btn-outline"
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                  onClick={() => onSelect(c.id)}
                >
                  <span style={{ textAlign: 'left' }}>
                    {otherId}
                    <span style={{ color: 'var(--color-text-dim)', marginLeft: 6, fontSize: 12 }}>
                      {new Date(c.last_message_at || c.created_at).toLocaleString()}
                    </span>
                  </span>
                  <span>Open</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
