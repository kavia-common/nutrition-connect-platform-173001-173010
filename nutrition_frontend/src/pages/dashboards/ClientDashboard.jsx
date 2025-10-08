import React from 'react';
import { Card, Loader, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import UpcomingMeals from '../../components/dashboard/widgets/UpcomingMeals';
import TodayWorkout from '../../components/dashboard/widgets/TodayWorkout';
import Hydration from '../../components/dashboard/widgets/Hydration';
import Streaks from '../../components/dashboard/widgets/Streaks';

/**
 * PUBLIC_INTERFACE
 * ClientDashboard
 * Dashboard for client role showing plan status and daily actions.
 */
export default function ClientDashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <Card><Loader /> Loading your dashboard...</Card>
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
              <h2 style={{ margin: 0 }}>Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}</h2>
              <p style={{ color: 'var(--color-text-dim)', marginTop: 6, marginBottom: 0 }}>
                Stay on track with today’s plan.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button>Log Meal</Button>
              <Button variant="outline">Start Workout</Button>
            </div>
          </div>
        </Card>

        <div style={{ gridColumn: 'span 8', display: 'grid', gap: 16 }}>
          <UpcomingMeals />
          <TodayWorkout />
        </div>
        <div style={{ gridColumn: 'span 4', display: 'grid', gap: 16 }}>
          <Hydration />
          <Streaks />
        </div>
      </div>
    </div>
  );
}
