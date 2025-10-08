import React, { useEffect, useMemo, useState } from 'react';
import { Card, Loader, Button, ErrorState, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { getClientProgress } from '../../lib/analyticsService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * ClientProgress
 * Shows client progress trends (weight, compliance) over time.
 */
export default function ClientProgress() {
  const { user, loading } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, data: [] });

  async function load() {
    if (!user?.id) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await getClientProgress(user.id, { days: 30 });
    setState({ loading: false, error: error ? (error.message || 'Failed to load progress') : null, data: data || [] });
  }

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const byDate = useMemo(() => {
    const map = {};
    (state.data || []).forEach((r) => {
      const key = r.date;
      map[key] = map[key] || { date: key };
      map[key][r.metric] = r.value;
    });
    return Object.values(map);
  }, [state.data]);

  if (loading || state.loading) {
    return (
      <div className="container">
        <Card><Loader /> Loading analytics...</Card>
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
          <ErrorState message={state.error} onRetry={load} data-testid="client-progress-error" />
        </Card>
      </div>
    );
  }

  const empty = !byDate.length;

  return (
    <div className="container" data-testid="client-progress-page">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0 }}>Your Progress</h2>
            <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
              Track key trends over time.
            </p>
          </div>
          <Button variant="outline" onClick={load}>Refresh</Button>
        </div>
      </Card>

      {empty ? (
        <Card style={{ marginTop: 16 }} data-testid="client-progress-empty">
          <EmptyState
            title="No progress data"
            description="Start logging check-ins to see your trends here."
            icon="📉"
            primaryAction={{ label: 'Refresh', onClick: load, ariaLabel: 'Refresh data' }}
          />
        </Card>
      ) : (
        <div style={{ marginTop: 16, display: 'grid', gap: 16 }}>
          <Card>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Weight Trend</div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={byDate} data-testid="client-progress-weight-chart">
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.75)" />
                  <YAxis stroke="rgba(255,255,255,0.75)" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#F97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Compliance</div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <AreaChart data={byDate} data-testid="client-progress-compliance-chart">
                  <defs>
                    <linearGradient id="complianceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.75)" />
                  <YAxis stroke="rgba(255,255,255,0.75)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="compliance" stroke="#10B981" fillOpacity={1} fill="url(#complianceFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
