import React, { useEffect, useRef, useState } from 'react';
import { Card, Loader } from '../common';
import { listMessages, sendMessage } from '../../lib/chatService';
import { useRealtime } from '../../hooks';
import MessageInput from './MessageInput';

export default function ChatPanel({ conversationId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    listMessages(conversationId).then(({ data }) => {
      setMessages(data || []);
      setLoading(false);
      scrollToBottom();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useRealtime(
    conversationId ? `messages-conv-${conversationId}` : null,
    conversationId
      ? [
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
            handler: (payload) => {
              if (payload?.new) {
                setMessages((prev) => [...prev, payload.new]);
                scrollToBottom();
              }
            },
          },
        ]
      : [],
    Boolean(conversationId)
  );

  function scrollToBottom() {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 0);
  }

  async function handleSend(text) {
    if (!text?.trim() || !conversationId || !currentUserId) return;
    const { error } = await sendMessage({ conversation_id: conversationId, sender_id: currentUserId, content: text.trim() });
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message || 'Failed to send message');
    }
  }

  if (!conversationId) {
    return (
      <Card style={{ height: '100%' }}>
        <div style={{ color: 'var(--color-text-dim)' }}>Select a conversation to start chatting.</div>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%', display: 'grid', gridTemplateRows: '1fr auto', overflow: 'hidden' }}>
      <div
        ref={listRef}
        style={{ overflow: 'auto', display: 'grid', gap: 8, paddingRight: 4 }}
      >
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <Loader />
          </div>
        )}
        {!loading && messages.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{
              background: m.sender_id === currentUserId ? 'rgba(16,185,129,0.12)' : 'var(--color-surface-2)',
              borderColor: m.sender_id === currentUserId ? 'rgba(16,185,129,0.35)' : 'var(--color-border)',
              justifySelf: m.sender_id === currentUserId ? 'end' : 'start',
              maxWidth: '70%',
            }}
          >
            <div style={{ fontSize: 14 }}>{m.content}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginTop: 4 }}>
              {new Date(m.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
        <MessageInput onSend={handleSend} />
      </div>
    </Card>
  );
}
