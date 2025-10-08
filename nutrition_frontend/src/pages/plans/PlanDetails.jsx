import React, { useEffect, useState } from 'react';
import { Button, Card, Loader, ErrorState, EmptyState } from '../../components/common';
import { fetchAssignmentsForPlan, fetchPlanWithItems } from '../../lib/plansService';
import { useParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * PlanDetails
 * Shows selected plan metadata, items grouped by item_type, and assigned clients.
 */
export default function PlanDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [items, setItems] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchPlanWithItems(id);
    if (err) setError(err.message || 'Failed to load plan');
    setPlan(data?.plan || null);
    setItems(data?.items || []);
    const { data: assigns, error: aErr } = await fetchAssignmentsForPlan(id);
    if (aErr) {
      // eslint-disable-next-line no-console
      console.warn('Assignments fetch failed', aErr);
    }
    setAssignments(assigns || []);
    setLoading(false);
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <Card>
          <Loader /> Loading plan...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Card>
          <ErrorState message={error} onRetry={load} />
        </Card>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container">
        <Card>Plan not found.</Card>
      </div>
    );
  }

  const grouped = items.reduce((acc, it) => {
    const k = it.item_type || 'other';
    acc[k] = acc[k] || [];
    acc[k].push(it);
    return acc;
  }, {});

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0 }}>{plan.name}</h2>
            <div style={{ color: 'var(--color-text-dim)' }}>
              {plan.type} • {items.length} items • {plan.status || 'draft'}
            </div>
          </div>
          {/* Placeholders for future actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" onClick={load}>Refresh</Button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <strong>Sections</strong>
          {!items.length && (
            <div style={{ marginTop: 8 }}>
              <EmptyState
                title="No sections"
                description="This plan has no items yet. Use the builder to add sections."
                icon="📄"
              />
            </div>
          )}
          {!!items.length && (
            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
              {Object.entries(grouped).map(([section, its]) => (
                <div key={section} className="card" style={{ background: 'var(--color-surface-2)' }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>{section.toUpperCase()}</div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {its.map((it) => (
                      <div key={it.id} className="card" style={{ background: 'transparent' }}>
                        <div style={{ fontWeight: 700 }}>{it.title}</div>
                        {it.details ? (
                          <div style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>
                            {typeof it.details === 'string' ? it.details : JSON.stringify(it.details)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <strong>Assigned Clients</strong>
          {!assignments.length && (
            <div style={{ marginTop: 8 }}>
              <EmptyState title="No assignments" description="This plan is not assigned to any clients yet." icon="👥" />
            </div>
          )}
          {!!assignments.length && (
            <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
              {assignments.map((a) => (
                <div key={`${a.plan_id}-${a.client_id}`} className="card" style={{ background: 'var(--color-surface-2)' }}>
                  <div style={{ fontWeight: 700 }}>
                    {a.profile ? `${a.profile.first_name || ''} ${a.profile.last_name || ''}`.trim() : a.client_id}
                  </div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>
                    Status: {a.status || 'active'} • {a.start_date || '—'} → {a.end_date || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
