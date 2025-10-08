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
- profiles: id (uuid, PK), role (text), display_name (text), onboarding_complete (bool), updated_at (timestamptz)
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

## Troubleshooting

- If you see permission errors, review RLS policies or use a service role key in SUPABASE_KEY for seeding.
- Ensure the expected table/column names match your database schema. Adjust the script if needed.
- The Node seeding script logs a summary table of inserted/updated counts.
