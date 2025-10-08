import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * SignUp
 * Email/password sign up form using Supabase via AuthContext.
 */
export default function SignUp() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      options: {
        // Best practice: Use SITE_URL env in deployment; fallback to window.location.origin here
        emailRedirectTo: `${window.location.origin}/auth/login`,
        data: {},
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Sign up failed' });
    } else {
      // Supabase v2 usually requires email confirmation depending on project settings.
      setMessage({
        type: 'success',
        text: 'Check your inbox to confirm your email. Then return to log in.',
      });
    }
    setSubmitting(false);
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <Card>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Create your account</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0, marginBottom: 16 }}>
          Join Nutrition Connect to work with your coach and manage your plans.
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
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/auth/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
