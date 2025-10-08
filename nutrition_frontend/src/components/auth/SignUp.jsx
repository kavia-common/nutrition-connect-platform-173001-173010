import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { t } from '../../utils/i18n';

/**
 * PUBLIC_INTERFACE
 * SignUp
 * Email/password sign up form using Supabase via AuthContext.
 */
export default function SignUp() {
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('role') === 'coach' ? 'coach' : 'client';
  const [roleTab, setRoleTab] = useState(initialTab);
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { getURL } = await import('../../utils/getURL');
    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${getURL()}auth/login`,
        data: {},
      },
      targetRole: roleTab,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message || t('auth.signup.failed') });
    } else {
      setMessage({
        type: 'success',
        text: t('auth.signup.successConfirm'),
      });
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
              {t('auth.signup.tabsCoach')}
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
              {t('auth.signup.tabsClient')}
            </button>
          </div>
          <h2 style={{ margin: 0 }}>{t('auth.signup.title')}</h2>
          <p style={{ color: 'var(--color-text-dim)', marginTop: 0 }}>
            {t('auth.signup.subtitle')}
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
            label={t('auth.signup.email')}
            type="email"
            placeholder={t('auth.signup.placeholderEmail')}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label={t('auth.signup.password')}
            type="password"
            placeholder={t('auth.signup.placeholderPassword')}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? t('auth.signup.submitting') : t('auth.signup.submit')}
          </Button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          {t('auth.signup.toLoginPrefix')}{' '}
          <Link to={`/auth/login?role=${roleTab}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('auth.signup.toLogin')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
