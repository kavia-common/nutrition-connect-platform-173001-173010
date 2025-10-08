import React, { useEffect, useMemo, useState } from 'react';
import { Card, Loader, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { getCoachPortfolio } from '../../lib/analyticsService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * CoachAnalytics
 * Shows portfolio metrics for a coach (active clients, plans, assignments, messages, MRR).
 */
export default function CoachAnalytics() {
  const { user, profile, loading } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const role = profile?.role || 'client';

  async function load() {
    if (!user?.id) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await getCoachPortfolio(user.id);
    setState({ loading: false, error: error ? (error.message || 'Failed to load analytics') : null, data: data || null });
  }

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loading || state.loading) {
    return (
      <div className="container">
        <Card><Loader /> Loading coach analytics...</Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <Card>Sign in required.</Card>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="container">
        <Card>
          <div
            className="card"
            style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.35)' }}
            data-testid="coach-analytics-error"
          >
            {state.error}
          </div>
          <div style={{ marginTop: 8 }}>
            <Button variant="outline" onClick={load}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  const d = state.data;
  const summary = [
    { name: 'Active Clients', value: d?.active_clients || 0 },
    { name: 'Plans', value: d?.plans || 0 },
    { name: 'Assignments', value: d?.assignments || 0 },
    { name: 'Msgs (7d)', value: d?.messages_7d || 0 },
  ];
  const pieData = [
    { name: 'Clients', value: d?.active_clients || 0, color: '#10B981' },
    { name: 'Plans', value: d?.plans || 0, color: '#F97316' },
    { name: 'Assignments', value: d?.assignments || 0, color: '#60A5FA' },
  ];

  return (
    <div className="container" data-testid="coach-analytics-page">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0 }}>Coach Analytics</h2>
            <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
              Portfolio performance overview.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="card" style={{ background: 'var(--color-surface-2)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>MRR</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }} data-testid="coach-analytics-mrr">
                ${d?.revenue_mrr ?? 0}
              </div>
            </div>
            <Button variant="outline" onClick={load}>Refresh</Button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr', marginTop: 16 }}>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Portfolio Summary</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={summary} data-testid="coach-analytics-bar">
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" />
                <YAxis stroke="rgba(255,255,255,0.75)" />
                <Tooltip />
                <Bar dataKey="value" fill="#F97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Composition</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart data-testid="coach-analytics-pie">
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
