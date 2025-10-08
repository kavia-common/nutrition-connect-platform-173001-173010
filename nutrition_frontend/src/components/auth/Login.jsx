import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { t } from '../../utils/i18n';

/**
 * PUBLIC_INTERFACE
 * Login
 * Email/password login form using Supabase via AuthContext.
 */
export default function Login() {
  const { signIn, completePostLoginRouting } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('role') === 'coach' ? 'coach' : 'client';
  const [roleTab, setRoleTab] = useState(initialTab);
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // info or error

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { data, error } = await signIn({ email: form.email, password: form.password, targetRole: roleTab });
    if (error) {
      setMessage({ type: 'error', text: error.message || t('auth.login.failed') });
    } else if (data?.session || data?.user) {
      setMessage({ type: 'success', text: t('auth.login.success') });
      const { path } = await completePostLoginRouting({ selectedRole: roleTab });
      navigate(path || '/dashboard', { replace: true });
    } else {
      setMessage({ type: 'info', text: t('auth.login.infoCheckEmail') });
    }
    setSubmitting(false);
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <Card>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 10, border: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setRoleTab('coach')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: roleTab === 'coach' ? 'var(--color-primary)' : 'transparent',
                background: roleTab === 'coach' ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: 'var(--color-text)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t('auth.login.tabsCoach')}
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('client')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: roleTab === 'client' ? 'var(--color-secondary)' : 'transparent',
                background: roleTab === 'client' ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: 'var(--color-text)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t('auth.login.tabsClient')}
            </button>
          </div>
          <h2 style={{ margin: 0 }}>{t('auth.login.title')}</h2>
          <p style={{ color: 'var(--color-text-dim)', marginTop: 0 }}>
            {t('auth.login.subtitle')}
          </p>
        </div>
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
            label={t('auth.login.email')}
            type="email"
            placeholder={t('auth.login.placeholderEmail')}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label={t('auth.login.password')}
            type="password"
            placeholder={t('auth.login.placeholderPassword')}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 14 }}>
          <Link to="/auth/reset" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('auth.login.forgot')}
          </Link>
          <Link to={`/auth/signup?role=${roleTab}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('auth.login.toSignup')}
          </Link>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to={`/auth/magic-link?role=${roleTab}`} style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
            {t('auth.login.magic')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
