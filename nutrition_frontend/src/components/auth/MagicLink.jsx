import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * MagicLink
 * Sends a Supabase magic link to the user's email for passwordless login.
 */
export default function MagicLink() {
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const { getURL } = await import('../../utils/getURL');
    const { error } = await sendMagicLink({
      email,
      options: {
        emailRedirectTo: `${getURL()}auth/login`,
      },
    });
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send magic link' });
    } else {
      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your inbox and follow the link to sign in.',
      });
    }
    setSubmitting(false);
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <Card>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Passwordless Sign In</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0, marginBottom: 16 }}>
          Enter your email and we’ll send you a secure magic link.
        </p>
        {message && (
          <div
            className="card"
            style={{
              borderColor:
                message.type === 'error'
                  ? 'rgba(239,68,68,0.45)'
                  : 'rgba(16,185,129,0.45)',
              background:
                message.type === 'error'
                  ? 'rgba(239,68,68,0.1)'
                  : 'rgba(16,185,129,0.1)',
              marginBottom: 12,
            }}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          Prefer password?{' '}
          <Link to="/auth/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
