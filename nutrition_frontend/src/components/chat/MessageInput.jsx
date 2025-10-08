import React, { useState } from 'react';
import { Button } from '../common';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSend?.(text);
      setText('');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        className="input"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send'}</Button>
    </form>
  );
}
