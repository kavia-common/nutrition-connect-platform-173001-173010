import React, { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { upsertProfile, upsertSettings, markOnboardingComplete, fetchSettings } from '../../lib/supabaseServices';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * CoachOnboarding
 * Multi-step coach onboarding: Profile -> Expertise & Certifications -> Availability -> Review
 */
export default function CoachOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    specialization: '',
    certifications: '',
    bio: '',
    availability: {
      // simple availability schema; if DB differs, it will still be stored as JSON
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    },
  });

  const steps = useMemo(() => ['Profile', 'Expertise', 'Availability', 'Review'], []);

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
      if (!form.specialization?.trim()) {
        setError('Please provide at least one specialization.');
        return false;
      }
      return true;
    }
    return true;
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function handleNext() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function updateAvailability(day, value) {
    setForm((f) => ({
      ...f,
      availability: {
        ...f.availability,
        [day]: value,
      },
    }));
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    setError(null);
    try {
      // Save profile with coach role
      const { error: pErr } = await upsertProfile(user.id, {
        first_name: form.first_name?.trim(),
        last_name: form.last_name?.trim(),
        timezone: form.timezone,
        role: profile?.role || 'coach',
        // Optionally include bio if exists in schema; if not, DB will ignore
        bio: form.bio || null,
      });
      if (pErr) throw pErr;

      // Save settings: availability and preferences (specialization/certs)
      const preferences = {
        specialization: form.specialization,
        certifications: form.certifications,
      };
      const { error: sErr } = await upsertSettings(user.id, {
        preferences,
        availability: form.availability,
      });
      if (sErr) throw sErr;

      const { error: mErr } = await markOnboardingComplete(user.id);
      if (mErr) throw mErr;

      await refreshProfile();
      navigate('/dashboard', { replace: true });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Coach onboarding submit error', e);
      setError(e.message || 'Failed to save your onboarding data.');
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
              background: 'var(--color-secondary)',
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
          placeholder="Alex"
          value={form.first_name}
          onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
          required
        />
        <Input
          label="Last name"
          placeholder="Johnson"
          value={form.last_name}
          onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
          required
        />
        <Input
          label="Timezone"
          placeholder="e.g., America/Los_Angeles"
          value={form.timezone}
          onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
        />
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>Short bio</label>
          <textarea
            className="input"
            rows={4}
            placeholder="Tell clients about your experience and approach..."
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </div>
      </div>
    );
  }

  function StepExpertise() {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Input
          label="Specialization"
          placeholder="Sports nutrition, weight management, etc."
          value={form.specialization}
          onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
          required
        />
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>Certifications</label>
          <textarea
            className="input"
            rows={3}
            placeholder="List your certifications, comma separated"
            value={form.certifications}
            onChange={(e) => setForm((f) => ({ ...f, certifications: e.target.value }))}
          />
        </div>
      </div>
    );
  }

  function AvailabilityRow({ day, label }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', gap: 8 }}>
        <div style={{ color: 'var(--color-text-dim)' }}>{label}</div>
        <Input
          placeholder="e.g., 09:00-12:00, 14:00-17:00"
          value={(form.availability?.[day] || []).join(', ')}
          onChange={(e) => {
            const parts = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            updateAvailability(day, parts);
          }}
        />
      </div>
    );
  }

  function StepAvailability() {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <AvailabilityRow day="mon" label="Monday" />
        <AvailabilityRow day="tue" label="Tuesday" />
        <AvailabilityRow day="wed" label="Wednesday" />
        <AvailabilityRow day="thu" label="Thursday" />
        <AvailabilityRow day="fri" label="Friday" />
        <AvailabilityRow day="sat" label="Saturday" />
        <AvailabilityRow day="sun" label="Sunday" />
      </div>
    );
  }

  function StepReview() {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>Name:</strong> {form.first_name} {form.last_name}</div>
        <div><strong>Timezone:</strong> {form.timezone}</div>
        <div><strong>Bio:</strong> {form.bio || '—'}</div>
        <div><strong>Specialization:</strong> {form.specialization}</div>
        <div><strong>Certifications:</strong> {form.certifications || '—'}</div>
        <div>
          <strong>Availability:</strong>
          <div style={{ marginTop: 6, color: 'var(--color-text-dim)' }}>
            {Object.entries(form.availability).map(([d, slots]) => (
              <div key={d} style={{ fontSize: 14 }}>
                {d.toUpperCase()}: {slots?.length ? slots.join(', ') : '—'}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>Coach Onboarding</h2>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 0 }}>
          Set up your coaching profile and availability so clients can connect with you.
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
        {step === 1 && <StepExpertise />}
        {step === 2 && <StepAvailability />}
        {step === 3 && <StepReview />}

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
