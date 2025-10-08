# Supabase Setup and Seeding

This project uses Supabase for authentication, database, and realtime features.

## Environment Variables

Create a `.env` file in `nutrition_frontend/` with:

- REACT_APP_SUPABASE_URL=your_supabase_url
- REACT_APP_SUPABASE_KEY=your_supabase_anon_or_service_key

Why REACT_APP_*? Create React App only exposes environment variables to the browser if they start with REACT_APP_. This is required for the frontend to initialize Supabase.

Node seeding:
- Preferred: use REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_KEY (already in your .env).
- Supported legacy: SUPABASE_URL / SUPABASE_KEY (the seed script will also look for these and fall back).

The seeding script first tries SUPABASE_URL/SUPABASE_KEY, and if not found, falls back to REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY.

## Database Tables Expected

The seed expects the following tables/columns (names can be adapted if your schema differs):
- profiles: id (uuid, PK), email (text), role (text), display_name (text), onboarding_complete (bool), updated_at (timestamptz)
- settings: user_id (uuid, unique), data (jsonb), updated_at (timestamptz)
- plans: id (uuid, PK), owner_id (uuid), title (text), type (text), description (text), created_at, updated_at
- plan_items: id (uuid, PK, default), plan_id (uuid, FK), title (text), details (text), order_index (int)
- plan_assignments: user_id (uuid), plan_id (uuid), status (text), created_at, updated_at
- conversations: id (uuid, PK), participant_a (uuid), participant_b (uuid), created_at, updated_at
- messages: id (uuid, PK, default), conversation_id (uuid), sender_id (uuid), content (text), created_at
- progress_logs: user_id (uuid), date (date), weight (numeric), macros_adherence (int), created_at, updated_at

Ensure Row Level Security (RLS) policies allow inserts by your current role (or run with a service key).

## Seeding Sample Data (Node)

From the `nutrition_frontend` directory:

1. Install dependencies (once):
   - npm install

2. Ensure your environment is set (either in shell or `.env`):
   - SUPABASE_URL / SUPABASE_KEY
   - or REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_KEY

3. Run:
   - node scripts/seedSupabase.js

The script is idempotent: it uses upsert or checks for existing rows to avoid duplicates.

It seeds:
- Two profiles (coach + client)
- Settings for both users
- Two plans (nutrition + workout) and their items
- An assignment linking the client to the nutrition plan
- One conversation between the two users with a few messages
- 7 days of progress_logs for the client

## In-App Minimal Seed (Development Only)

In development builds only (NODE_ENV=development), a "Seed Sample Data" button appears in Settings pages (Profile, Billing, Notifications). Clicking it performs a minimal seed via the browser client:
- Creates a simple nutrition plan and plan items
- Assigns it to the current client (if logged in as a client)
- Creates a conversation with a welcome message

This is useful when Node execution isn't available.

## Sending magic links for admins (dev flow)

- CLI: `node scripts/sendMagicLink.js --email="nutriekspert@gmail.com" --admin`
  - Script triggers `auth.signInWithOtp` and attempts to upsert a `profiles` row with `role='admin'` immediately if the user exists (service role key recommended).
  - If the user does not exist yet (unconfirmed), a deferred upsert occurs on the first login (see below).
- UI (dev only): In Settings → Profile, use the "Send Magic Link (Dev)" button to trigger `auth.signInWithOtp` from the browser client.

## Deferred admin assignment on first login (development safeguard)

The app checks `window.__DEV_ADMIN_EMAILS` in development. If the logged-in user's email is listed, the app upserts the profile with `role='admin'` and `onboarding_complete=true`.

Example (place in a dev-only bootstrap script or index.html for local runs):
<script>
  window.__DEV_ADMIN_EMAILS = ['nutriekspert@gmail.com'];
</script>

This behavior is ignored in production builds.

## Redirect handling

The magic link uses `getURL('/auth/callback')`, which resolves using `REACT_APP_SITE_URL` if present and defaults to `http://localhost:3000`.

## Expected result

After sending a magic link and completing sign-in, the `profiles` row for the user will have `role=admin` and `onboarding_complete=true`.
