import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Drawer, Input, Loader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { createPlan, deletePlan, fetchPlansByCoach } from '../../lib/plansService';
import NutritionBuilder from './NutritionBuilder';
import WorkoutBuilder from './WorkoutBuilder';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * PlanList
 * Lists coach's plans with create, open, and delete actions.
 * Opens drawer-based builders for quick draft creation.
 */
export default function PlanList() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const coachId = user?.id; // assuming coaches create plans; admins could later filter

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  // Drawer states
  const [openType, setOpenType] = useState(null); // 'nutrition' | 'workout' | null
  const [draftMeta, setDraftMeta] = useState({ name: '', notes: '' });

  async function load() {
    if (!coachId) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchPlansByCoach(coachId);
    if (err) setError(err.message || 'Failed to load plans');
    setPlans(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachId]);

  const empty = !loading && !plans?.length;

  function NewMenu() {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => { setDraftMeta({ name: '', notes: '' }); setOpenType('nutrition'); }}>
          New Nutrition Plan
        </Button>
        <Button variant="outline" onClick={() => { setDraftMeta({ name: '', notes: '' }); setOpenType('workout'); }}>
          New Workout Plan
        </Button>
      </div>
    );
  }

  async function handleDelete(planId) {
    // simple confirmation
    if (!window.confirm('Delete this plan? This cannot be undone.')) return;
    const { error: err } = await deletePlan(planId);
    if (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to delete plan');
    }
    await load();
  }

  async function handleSaveNutrition(draft) {
    // draft: { name, notes, items }
    const { data, error: err } = await createPlan({
      coach_id: coachId,
      name: draft?.name || 'Untitled Plan',
      type: 'nutrition',
      notes: draft?.notes || '',
      items: draft?.items || [],
    });
    if (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to create nutrition plan');
      return;
    }
    setOpenType(null);
    await load();
    if (data?.id) navigate(`/plans/${data.id}`);
  }

  async function handleSaveWorkout(draft) {
    const { data, error: err } = await createPlan({
      coach_id: coachId,
      name: draft?.name || 'Untitled Plan',
      type: 'workout',
      notes: draft?.notes || '',
      items: draft?.items || [],
    });
    if (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to create workout plan');
      return;
    }
    setOpenType(null);
    await load();
    if (data?.id) navigate(`/plans/${data.id}`);
  }

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0 }}>Plans</h2>
            <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
              Create and manage nutrition and workout plans.
            </p>
          </div>
          <NewMenu />
        </div>
      </Card>

      {loading && (
        <Card>
          <Loader /> Loading your plans...
        </Card>
      )}

      {error && !loading && (
        <Card>
          <div
            className="card"
            style={{
              background: 'rgba(239,68,68,0.12)',
              borderColor: 'rgba(239,68,68,0.35)',
            }}
          >
            {error}
          </div>
        </Card>
      )}

      {empty && (
        <Card>
          <div style={{ display: 'grid', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 700 }}>No plans yet</div>
            <div style={{ color: 'var(--color-text-dim)' }}>
              Get started by creating a new nutrition or workout plan.
            </div>
            <NewMenu />
          </div>
        </Card>
      )}

      {!loading && !!plans.length && (
        <div style={{ display: 'grid', gap: 12 }}>
          {plans.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800 }}>
                  {p.name} <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>• {p.type}</span>
                </div>
                <div style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>
                  {p.item_count || 0} items • {p.status || 'draft'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => navigate(`/plans/${p.id}`)}>Open</Button>
                <Button variant="outline" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nutrition Builder Drawer */}
      <Drawer
        open={openType === 'nutrition'}
        onClose={() => setOpenType(null)}
        title="New Nutrition Plan"
        width={460}
      >
        <NutritionBuilder
          initial={{ name: draftMeta.name, notes: draftMeta.notes }}
          onCancel={() => setOpenType(null)}
          onSave={handleSaveNutrition}
        />
      </Drawer>

      {/* Workout Builder Drawer */}
      <Drawer
        open={openType === 'workout'}
        onClose={() => setOpenType(null)}
        title="New Workout Plan"
        width={460}
      >
        <WorkoutBuilder
          initial={{ name: draftMeta.name, notes: draftMeta.notes }}
          onCancel={() => setOpenType(null)}
          onSave={handleSaveWorkout}
        />
      </Drawer>
    </div>
  );
}
