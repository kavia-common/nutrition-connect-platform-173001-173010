import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login
 * Email/password login form using Supabase via AuthContext.
 */
export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // info or error

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { data, error } = await signIn({ email: form.email, password: form.password });
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Login failed' });
    } else if (data?.session) {
      setMessage({ type: 'success', text: 'Logged in! Redirecting...' });
      navigate('/dashboard');
    } else {
      setMessage({ type: 'info', text: 'Check your email for confirmation if required.' });
    }
    setSubmitting(false);
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <Card>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Welcome back</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0, marginBottom: 16 }}>
          Sign in to your Nutrition Connect account.
        </p>
        {message && (
          <div
            className="card"
            style={{
              borderColor:
                message.type === 'error'
                  ? 'rgba(239,68,68,0.45)'
                  : message.type === 'success'
                  ? 'rgba(16,185,129,0.45)'
                  : 'var(--color-border)',
              background:
                message.type === 'error'
                  ? 'rgba(239,68,68,0.1)'
                  : message.type === 'success'
                  ? 'rgba(16,185,129,0.1)'
                  : 'var(--color-surface)',
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
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 14 }}>
          <Link to="/auth/reset" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Forgot password?
          </Link>
          <Link to="/auth/signup" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Create account
          </Link>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/auth/magic-link" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
            Sign in with Magic Link
          </Link>
        </div>
      </Card>
    </div>
  );
}
