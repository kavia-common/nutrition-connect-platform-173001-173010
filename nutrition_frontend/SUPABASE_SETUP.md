IMPORTANT: Supabase Configuration Required

1. In your Supabase Dashboard:
   - Go to Authentication > URL Configuration
   - Set Site URL to your production domain (e.g., https://yourapp.com)
   - Add these Redirect URLs:
     * http://localhost:3000/**
     * https://yourapp.com/**

2. Environment Variables:
   - REACT_APP_SUPABASE_URL=your-supabase-project-url
   - REACT_APP_SUPABASE_KEY=your-anon-or-service-role-key (frontend should use anon)

   Optional for redirects:
   - REACT_APP_SITE_URL=https://yourapp.com

3. Email Templates (optional):
   - Authentication > Email Templates. Ensure links accept redirectTo values.

4. Frontend integration notes:
   - src/lib/supabaseClient.js reads envs and initializes client
   - src/utils/getURL.js centralizes redirect URL construction
   - Auth flows use getURL() for redirectTo/emailRedirectTo

5. Realtime:
   - messages table is RLS-enabled; subscribe via supabase-js channel in chatService.subscribeToMessages
