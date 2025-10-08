#!/usr/bin/env node
/**
 * Seed Supabase with sample data for quick UI validation.
 *
 * This script:
 * - Reads env: SUPABASE_URL/SUPABASE_KEY (fallback to REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY)
 * - Upserts:
 *   profiles (coach + client), settings for each, plans (2), plan_items, plan_assignments,
 *   conversations, messages, progress_logs (7 days)
 * - Guards against duplicates via upsert on natural keys/primary keys and existence checks
 *
 * Usage:
 *   node scripts/seedSupabase.js
 *
 * Exit codes:
 *   0 success, 1 error
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Helper to get env vars with optional fallback name.
 * For this project, we try both SUPABASE_* and REACT_APP_SUPABASE_*.
 */
function getEnv(name, fallbackName) {
  return process.env[name] || (fallbackName ? process.env[fallbackName] : '') || '';
}

// Deterministic UUID based on namespace so re-runs keep IDs stable.
function uuidFromString(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 32).replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

// PUBLIC_INTERFACE
async function main() {
  /** Entry point for seeding script. */
  const SUPABASE_URL = getEnv('SUPABASE_URL', 'REACT_APP_SUPABASE_URL');
  const SUPABASE_KEY = getEnv('SUPABASE_KEY', 'REACT_APP_SUPABASE_KEY');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase env.');
    console.error('- Preferred (frontend/CRA): set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in nutrition_frontend/.env');
    console.error('- Legacy/Node: SUPABASE_URL and SUPABASE_KEY are also supported.');
    console.error('Tip: Copy .env.example to .env and fill in your Supabase credentials.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });

  // Create stable IDs
  const coach_id = uuidFromString('seed-coach-uid');
  const client_id = uuidFromString('seed-client-uid');
  const nutrition_plan_id = uuidFromString('seed-plan-nutrition');
  const workout_plan_id = uuidFromString('seed-plan-workout');
  const conversation_id = uuidFromString('seed-conversation-coach-client');

  const counters = {
    profiles: 0,
    settings: 0,
    plans: 0,
    plan_items: 0,
    plan_assignments: 0,
    conversations: 0,
    messages: 0,
    progress_logs: 0,
  };

  try {
    // 1) profiles (assumes table: profiles with id (UUID), role, display_name, onboarding_complete)
    {
      const profiles = [
        {
          id: coach_id,
          role: 'coach',
          display_name: 'Coach Casey',
          onboarding_complete: true,
          // add additional fields only if table has them, safe to include common fields
          updated_at: new Date().toISOString(),
        },
        {
          id: client_id,
          role: 'client',
          display_name: 'Client Chris',
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        },
      ];
      const { error } = await supabase.from('profiles').upsert(profiles, { onConflict: 'id' });
      if (error) throw new Error(`profiles upsert failed: ${error.message}`);
      counters.profiles = profiles.length;
    }

    // 2) settings per user (assumes table: settings with user_id unique, data JSON)
    {
      const settingsRows = [
        {
          user_id: coach_id,
          data: {
            notifications: { email: true, sms: false, push: true },
            theme: 'dark',
          },
          updated_at: new Date().toISOString(),
        },
        {
          user_id: client_id,
          data: {
            notifications: { email: true, sms: true, push: false },
            theme: 'dark',
          },
          updated_at: new Date().toISOString(),
        },
      ];
      // Not all Supabase schemas have unique on user_id; do guard existence then upsert
      for (const row of settingsRows) {
        const { data: existing, error: selErr } = await supabase
          .from('settings')
          .select('user_id')
          .eq('user_id', row.user_id)
          .limit(1)
          .maybeSingle();
        if (selErr) throw new Error(`settings select error: ${selErr.message}`);
        if (existing) {
          const { error: updErr } = await supabase.from('settings').update(row).eq('user_id', row.user_id);
          if (updErr) throw new Error(`settings update failed: ${updErr.message}`);
        } else {
          const { error: insErr } = await supabase.from('settings').insert(row);
          if (insErr) throw new Error(`settings insert failed: ${insErr.message}`);
        }
      }
      counters.settings = settingsRows.length;
    }

    // 3) plans (assumes: plans with id UUID, owner_id, title, type, description)
    {
      const plans = [
        {
          id: nutrition_plan_id,
          owner_id: coach_id,
          title: 'Starter Nutrition Plan',
          type: 'nutrition',
          description: 'A 7-day simple nutrition plan to kickstart healthy eating.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: workout_plan_id,
          owner_id: coach_id,
          title: 'Beginner Workout Plan',
          type: 'workout',
          description: 'A 3-day full body routine for beginners.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      const { error } = await supabase.from('plans').upsert(plans, { onConflict: 'id' });
      if (error) throw new Error(`plans upsert failed: ${error.message}`);
      counters.plans = plans.length;

      // plan_items (assumes: plan_items with plan_id, title, details, day_index or order_index)
      const planItems = [
        // Nutrition items
        { plan_id: nutrition_plan_id, title: 'Breakfast: Oatmeal + Berries', details: 'Rolled oats, almond milk, blueberries', order_index: 1 },
        { plan_id: nutrition_plan_id, title: 'Lunch: Grilled Chicken Salad', details: 'Mixed greens, cherry tomatoes, vinaigrette', order_index: 2 },
        { plan_id: nutrition_plan_id, title: 'Dinner: Salmon + Quinoa', details: 'Baked salmon, quinoa, asparagus', order_index: 3 },
        // Workout items
        { plan_id: workout_plan_id, title: 'Day 1: Full Body A', details: 'Squat, Bench, Row', order_index: 1 },
        { plan_id: workout_plan_id, title: 'Day 2: Rest/Cardio', details: '30 min brisk walk', order_index: 2 },
        { plan_id: workout_plan_id, title: 'Day 3: Full Body B', details: 'Deadlift, OHP, Pull-ups', order_index: 3 },
      ];

      // Upsert by natural key (plan_id + title) if supported; otherwise guard via check
      for (const item of planItems) {
        const { data: existing, error: selErr } = await supabase
          .from('plan_items')
          .select('id')
          .eq('plan_id', item.plan_id)
          .eq('title', item.title)
          .limit(1)
          .maybeSingle();
        if (selErr) throw new Error(`plan_items select error: ${selErr.message}`);
        if (existing) {
          const { error: updErr } = await supabase.from('plan_items').update(item).eq('id', existing.id);
          if (updErr) throw new Error(`plan_items update failed: ${updErr.message}`);
        } else {
          const { error: insErr } = await supabase.from('plan_items').insert(item);
          if (insErr) throw new Error(`plan_items insert failed: ${insErr.message}`);
        }
      }
      counters.plan_items = planItems.length;
    }

    // 4) plan_assignments (assumes: plan_assignments with user_id, plan_id, status)
    {
      const assignment = {
        user_id: client_id,
        plan_id: nutrition_plan_id,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      // Guard existence by unique (user_id, plan_id)
      const { data: existing, error: selErr } = await supabase
        .from('plan_assignments')
        .select('user_id, plan_id')
        .eq('user_id', assignment.user_id)
        .eq('plan_id', assignment.plan_id)
        .limit(1)
        .maybeSingle();
      if (selErr) throw new Error(`plan_assignments select error: ${selErr.message}`);
      if (existing) {
        const { error: updErr } = await supabase
          .from('plan_assignments')
          .update({ status: assignment.status, updated_at: assignment.updated_at })
          .eq('user_id', assignment.user_id)
          .eq('plan_id', assignment.plan_id);
        if (updErr) throw new Error(`plan_assignments update failed: ${updErr.message}`);
      } else {
        const { error: insErr } = await supabase.from('plan_assignments').insert(assignment);
        if (insErr) throw new Error(`plan_assignments insert failed: ${insErr.message}`);
      }
      counters.plan_assignments = 1;
    }

    // 5) conversations and messages (assumes: conversations with id UUID, participant_a, participant_b; messages with conversation_id, sender_id, content, created_at)
    {
      const conversation = {
        id: conversation_id,
        participant_a: coach_id,
        participant_b: client_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { error: convErr } = await supabase.from('conversations').upsert(conversation, { onConflict: 'id' });
      if (convErr) throw new Error(`conversations upsert failed: ${convErr.message}`);
      counters.conversations = 1;

      const start = Date.now() - 1000 * 60 * 20; // start 20 min ago
      const msgs = [
        { conversation_id: conversation_id, sender_id: coach_id, content: 'Hi Chris! Welcome aboard 👋', created_at: new Date(start).toISOString() },
        { conversation_id: conversation_id, sender_id: client_id, content: 'Thanks Coach! Excited to start.', created_at: new Date(start + 1000 * 60 * 3).toISOString() },
        { conversation_id: conversation_id, sender_id: coach_id, content: 'I just assigned your starter nutrition plan. Let me know any preferences.', created_at: new Date(start + 1000 * 60 * 6).toISOString() },
        { conversation_id: conversation_id, sender_id: client_id, content: 'Looks great! I prefer oatmeal for breakfast.', created_at: new Date(start + 1000 * 60 * 9).toISOString() },
      ];

      // Insert messages if not already present (avoid duplicates by exact match on content+timestamp)
      let added = 0;
      for (const m of msgs) {
        const { data: existing, error: selErr } = await supabase
          .from('messages')
          .select('id')
          .eq('conversation_id', m.conversation_id)
          .eq('sender_id', m.sender_id)
          .eq('content', m.content)
          .eq('created_at', m.created_at)
          .limit(1)
          .maybeSingle();
        if (selErr) throw new Error(`messages select error: ${selErr.message}`);
        if (!existing) {
          const { error: insErr } = await supabase.from('messages').insert(m);
          if (insErr) throw new Error(`messages insert failed: ${insErr.message}`);
          added += 1;
        }
      }
      counters.messages = added;
    }

    // 6) progress_logs for last 7 days (assumes: progress_logs with user_id, date, weight, macros_adherence)
    {
      const today = new Date();
      const rows = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD
        rows.push({
          user_id: client_id,
          date: dateStr,
          weight: 175 - (6 - i) * 0.5, // fake slight downward trend
          macros_adherence: Math.min(100, 80 + (6 - i) * 3),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Upsert/guard by unique (user_id, date)
      let affected = 0;
      for (const row of rows) {
        const { data: existing, error: selErr } = await supabase
          .from('progress_logs')
          .select('user_id,date')
          .eq('user_id', row.user_id)
          .eq('date', row.date)
          .limit(1)
          .maybeSingle();
        if (selErr) throw new Error(`progress_logs select error: ${selErr.message}`);
        if (existing) {
          const { error: updErr } = await supabase
            .from('progress_logs')
            .update({ weight: row.weight, macros_adherence: row.macros_adherence, updated_at: row.updated_at })
            .eq('user_id', row.user_id)
            .eq('date', row.date);
          if (updErr) throw new Error(`progress_logs update failed: ${updErr.message}`);
        } else {
          const { error: insErr } = await supabase.from('progress_logs').insert(row);
          if (insErr) throw new Error(`progress_logs insert failed: ${insErr.message}`);
        }
        affected += 1;
      }
      counters.progress_logs = affected;
    }

    console.log('Seed completed.');
    console.table(counters);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err?.message || err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Run only if executed directly
  // eslint-disable-next-line no-void
  void main();
}

export default main;
