import React, { useEffect, useMemo, useState } from 'react';
import { Card, Loader, Button, ErrorState } from '../../components/common';
import { getAdminMetrics } from '../../lib/analyticsService';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, BarChart, Bar,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * AdminAnalytics
 * Shows platform-wide metrics for admins.
 */
export default function AdminAnalytics() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await getAdminMetrics();
    setState({ loading: false, error: error ? (error.message || 'Failed to load admin metrics') : null, data: data || null });
  }

  useEffect(() => {
    load();
  }, []);

  if (state.loading) {
    return (
      <div className="container">
        <Card><Loader /> Loading admin analytics...</Card>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="container">
        <Card>
          <ErrorState message={state.error} onRetry={load} data-testid="admin-analytics-error" />
        </Card>
      </div>
    );
  }

  const d = state.data || {};
  // Build a lightweight timeseries placeholder using metrics to visualize trends
  const series = Array.from({ length: 12 }).map((_, idx) => {
    const date = new Date(Date.now() - (11 - idx) * 86400000).toISOString().slice(0, 10);
    return {
      date,
      active: Math.max(0, (d.active_users || 0) - (11 - idx) * 5 + (idx % 3) * 7),
      messages: Math.max(0, (d.messages_24h || 0) - (11 - idx) * 2 + (idx % 4) * 3),
    };
  });
  const summary = [
    { name: 'Users', value: d.active_users || 0 },
    { name: 'Clients', value: d.total_clients || 0 },
    { name: 'Coaches', value: d.total_coaches || 0 },
    { name: 'Plans', value: d.plans || 0 },
  ];

  return (
    <div className="container" data-testid="admin-analytics-page">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0 }}>Admin Analytics</h2>
            <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
              Platform usage and growth metrics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="card" style={{ background: 'var(--color-surface-2)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>MRR</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }} data-testid="admin-analytics-mrr">
                ${d?.mrr ?? 0}
              </div>
            </div>
            <div className="card" style={{ background: 'var(--color-surface-2)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Growth</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-secondary)' }} data-testid="admin-analytics-growth">
                +{d?.growth_mom ?? 0}% MoM
              </div>
            </div>
            <Button variant="outline" onClick={load}>Refresh</Button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr', marginTop: 16 }}>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Activity Trends</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={series} data-testid="admin-analytics-line">
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.75)" />
                <YAxis stroke="rgba(255,255,255,0.75)" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#F97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="messages" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Summary</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={summary} data-testid="admin-analytics-bar">
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" />
                <YAxis stroke="rgba(255,255,255,0.75)" />
                <Tooltip />
                <Bar dataKey="value" fill="#60A5FA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
