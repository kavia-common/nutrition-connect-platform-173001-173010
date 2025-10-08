import React from 'react';
import { Card, Loader, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import RevenueSnapshot from '../../components/dashboard/widgets/RevenueSnapshot';
import SystemMetrics from '../../components/dashboard/widgets/SystemMetrics';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard
 * Dashboard for admin role with system and business overview widgets.
 */
export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <Card><Loader /> Loading admin overview...</Card>
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

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(12, 1fr)' }}>
        <Card style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <h2 style={{ margin: 0 }}>Admin Overview</h2>
              <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
                Platform health and revenue performance at a glance.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button>Export</Button>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </Card>

        <div style={{ gridColumn: 'span 8', display: 'grid', gap: 16 }}>
          <RevenueSnapshot />
        </div>
        <div style={{ gridColumn: 'span 4', display: 'grid', gap: 16 }}>
          <SystemMetrics />
        </div>
      </div>
    </div>
  );
}
