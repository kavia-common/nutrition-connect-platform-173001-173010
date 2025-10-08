import React, { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import { Input, Button, Loader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { upsertProfile, upsertSettings, markOnboardingComplete, fetchSettings } from '../../lib/supabaseServices';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ClientOnboarding
 * Multi-step client onboarding: Profile -> Goals & Preferences -> Confirm
 * Persists to Supabase profiles and settings tables.
 */
export default function ClientOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    goals: '',
    dietary_preferences: '',
    notifications: true,
  });

  const steps = useMemo(() => ['Profile', 'Goals & Preferences', 'Review'], []);

  if (!user) {
    return (
      <div className="container">
        <Card>Sign in required.</Card>
      </div>
    );
  }

  function validateCurrentStep() {
    setError(null);
    if (step === 0) {
      if (!form.first_name?.trim() || !form.last_name?.trim()) {
        setError('Please provide your first and last name.');
        return false;
      }
      return true;
    }
    if (step === 1) {
      // optional validation
      return true;
    }
    return true;
  }

  async function handleNext() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    setError(null);
    try {
      // Persist profile minimal fields
      const { error: pErr } = await upsertProfile(user.id, {
        first_name: form.first_name?.trim(),
        last_name: form.last_name?.trim(),
        timezone: form.timezone,
        role: profile?.role || 'client', // if role missing, set to client
      });
      if (pErr) throw pErr;

      // Persist settings
      const preferences = {
        goals: form.goals,
        dietary_preferences: form.dietary_preferences,
        notifications: !!form.notifications,
      };
      const { error: sErr } = await upsertSettings(user.id, { preferences });
      if (sErr) throw sErr;

      // Mark onboarding complete
      const { error: mErr } = await markOnboardingComplete(user.id);
      if (mErr) throw mErr;

      await refreshProfile();
      navigate('/dashboard', { replace: true });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Onboarding submit error', e);
      setError(e.message || 'Failed to save your onboarding data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function Progress() {
    const pct = ((step + 1) / steps.length) * 100;
    return (
      <div style={{ margin: '8px 0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-dim)' }}>
          <span>{steps[step]}</span>
          <span>
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'var(--color-primary)',
              borderRadius: 8,
              transition: 'width 180ms ease',
            }}
          />
        </div>
      </div>
    );
  }

  function StepProfile() {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Input
          label="First name"
          placeholder="Jane"
          value={form.first_name}
          onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
          required
        />
        <Input
          label="Last name"
          placeholder="Doe"
          value={form.last_name}
          onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
          required
        />
        <Input
          label="Timezone"
          placeholder="e.g., America/New_York"
          value={form.timezone}
          onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
        />
      </div>
    );
  }

  function StepGoals() {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>Goals</label>
          <textarea
            className="input"
            rows={4}
            placeholder="Describe your nutrition/fitness goals..."
            value={form.goals}
            onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))}
          />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>Dietary preferences</label>
          <textarea
            className="input"
            rows={3}
            placeholder="E.g., vegetarian, dairy-free, dislikes spicy foods..."
            value={form.dietary_preferences}
            onChange={(e) => setForm((f) => ({ ...f, dietary_preferences: e.target.value }))}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            id="notif-toggle"
            type="checkbox"
            checked={!!form.notifications}
            onChange={(e) => setForm((f) => ({ ...f, notifications: e.target.checked }))}
          />
          <label htmlFor="notif-toggle" style={{ color: 'var(--color-text)' }}>
            Receive notifications and reminders
          </label>
        </div>
      </div>
    );
  }

  function StepReview() {
    return (
      <div style={{ display: 'grid', gap: 8, color: 'var(--color-text)' }}>
        <div><strong>Name:</strong> {form.first_name} {form.last_name}</div>
        <div><strong>Timezone:</strong> {form.timezone}</div>
        <div><strong>Goals:</strong> {form.goals || '—'}</div>
        <div><strong>Dietary preferences:</strong> {form.dietary_preferences || '—'}</div>
        <div><strong>Notifications:</strong> {form.notifications ? 'Enabled' : 'Disabled'}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>Client Onboarding</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0 }}>
          Complete your profile to personalize your coaching experience.
        </p>

        <Progress />

        {error && (
          <div
            className="card"
            style={{
              background: 'rgba(239,68,68,0.12)',
              borderColor: 'rgba(239,68,68,0.35)',
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {step === 0 && <StepProfile />}
        {step === 1 && <StepGoals />}
        {step === 2 && <StepReview />}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Button variant="outline" onClick={handleBack} disabled={step === 0 || submitting}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting}>
              Finish
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
