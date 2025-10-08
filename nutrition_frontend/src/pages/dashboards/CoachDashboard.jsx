import React from 'react';
import { Card, Loader, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import ClientList from '../../components/dashboard/widgets/ClientList';
import ReviewQueue from '../../components/dashboard/widgets/ReviewQueue';
import PlanTemplates from '../../components/dashboard/widgets/PlanTemplates';

/**
 * PUBLIC_INTERFACE
 * CoachDashboard
 * Dashboard for coach role with client management widgets.
 */
export default function CoachDashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <Card><Loader /> Preparing your coaching dashboard...</Card>
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
              <h2 style={{ margin: 0 }}>Coach Dashboard</h2>
              <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
                Manage clients, review check-ins, and build plans.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button>New Plan</Button>
              <Button variant="outline">Invite Client</Button>
            </div>
          </div>
        </Card>

        <div style={{ gridColumn: 'span 8', display: 'grid', gap: 16 }}>
          <ClientList />
          <ReviewQueue />
        </div>
        <div style={{ gridColumn: 'span 4', display: 'grid', gap: 16 }}>
          <PlanTemplates />
        </div>
      </div>
    </div>
  );
}
