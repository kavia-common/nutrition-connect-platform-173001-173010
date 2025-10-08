# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design with KAVIA brand styling
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open http://localhost:3000 to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Supabase environment variables

This app is built with Create React App. Frontend env vars must be prefixed with REACT_APP_ to be available in the browser.

Add these to `nutrition_frontend/.env`:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (the full preview/site origin used for email redirects, e.g. https://vscode-internal-37918-beta.beta01.cloud.kavia.ai:4000)

Refer to `.env.example` for details. Do not commit real secrets.

## Dev Admin Magic Link

You can send a Supabase passwordless magic link and seed an admin profile:

- CLI:
  - Ensure env vars are set: `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_KEY` (service role key preferred for seeding).
  - Run: `node scripts/sendMagicLink.js --email="nutriekspert@gmail.com" --admin`
  - A deferred upsert will set role=admin on first login if the user does not exist yet.

- UI (dev only):
  - Open Settings → Profile.
  - Use the "Send Magic Link (Dev)" button. It calls an in-app helper to trigger the magic link to the email shown.

Notes:
- The redirect is configured via getURL('/auth/callback').
- On first login in development, if `window.__DEV_ADMIN_EMAILS` includes the user email, the profile is upserted with role=admin. See SUPABASE_SETUP.md.

## Seeding sample data (Supabase)

For quick UI validation, you can seed sample data into your Supabase project.

- Ensure environment variables are set in `.env`:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

Then run from the `nutrition_frontend` directory:

- node scripts/seedSupabase.js

Notes:
- The seed script supports both SUPABASE_URL/SUPABASE_KEY and REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY. Prefer the CRA-prefixed vars for consistency.
- Alternatively, in development mode, a "Seed Sample Data" button is available in Settings pages (Profile, Billing, Notifications) that performs a minimal seed using the browser client.

See SUPABASE_SETUP.md for detailed instructions and table expectations.

## Learn More

To learn React, check out the React documentation.

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
