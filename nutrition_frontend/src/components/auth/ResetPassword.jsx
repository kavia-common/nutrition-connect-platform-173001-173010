import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ResetPassword
 * Requests a password reset email from Supabase.
 */
export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { error } = await resetPassword({ email });
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send reset email' });
    } else {
      setMessage({
        type: 'success',
        text: 'If an account exists for that email, a reset link has been sent.',
      });
    }
    setSubmitting(false);
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <Card>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Reset your password</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0, marginBottom: 16 }}>
          Enter your email and we’ll send you a link to set a new password.
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
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <Link to="/auth/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
