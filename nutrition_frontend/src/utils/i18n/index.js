//
// Simple i18n utility with HR support and EN fallback.
// Usage: import { t, setLang, getLang } from './index';
// t('auth.login.title')
// setLang('hr')
//
const en = {
  auth: {
    role: {
      coach: 'Coach',
      client: 'Client',
    },
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to your Nutrition Connect account.',
      email: 'Email',
      password: 'Password',
      placeholderEmail: 'you@example.com',
      placeholderPassword: 'Your password',
      submit: 'Sign In',
      submitting: 'Signing in...',
      magic: 'Sign in with Magic Link',
      forgot: 'Forgot password?',
      toSignup: 'Create account',
      success: 'Logged in! Redirecting...',
      infoCheckEmail: 'Check your email for confirmation if required.',
      failed: 'Login failed',
      tabsCoach: 'Coach',
      tabsClient: 'Client',
    },
    signup: {
      title: 'Create your account',
      subtitle: 'Join Nutrition Connect to work with your coach and manage your plans.',
      email: 'Email',
      password: 'Password',
      placeholderEmail: 'you@example.com',
      placeholderPassword: 'Create a password',
      submit: 'Sign Up',
      submitting: 'Creating...',
      toLoginPrefix: 'Already have an account?',
      toLogin: 'Sign in',
      successConfirm: 'Check your inbox to confirm your email. Then return to log in.',
      failed: 'Sign up failed',
      tabsCoach: 'Coach',
      tabsClient: 'Client',
      roleSelectLabel: 'Choose role',
    },
    messages: {
      willRedirect: 'Redirecting...',
    },
  },
};

const hr = {
  auth: {
    role: {
      coach: 'Coach',
      client: 'Klijent',
    },
    login: {
      title: 'Dobrodošli natrag',
      subtitle: 'Prijavite se u svoj Nutrition Connect račun.',
      email: 'Email',
      password: 'Lozinka',
      placeholderEmail: 'vi@primjer.com',
      placeholderPassword: 'Vaša lozinka',
      submit: 'Prijava',
      submitting: 'Prijava u tijeku...',
      magic: 'Prijava putem Magic Linka',
      forgot: 'Zaboravljena lozinka?',
      toSignup: 'Kreiraj račun',
      success: 'Uspješna prijava! Preusmjeravanje...',
      infoCheckEmail: 'Provjerite e-mail za potvrdu ako je potrebno.',
      failed: 'Prijava nije uspjela',
      tabsCoach: 'Coach',
      tabsClient: 'Klijent',
    },
    signup: {
      title: 'Kreirajte svoj račun',
      subtitle: 'Pridružite se Nutrition Connectu za suradnju s coachom i upravljanje planovima.',
      email: 'Email',
      password: 'Lozinka',
      placeholderEmail: 'vi@primjer.com',
      placeholderPassword: 'Kreirajte lozinku',
      submit: 'Registracija',
      submitting: 'Kreiranje...',
      toLoginPrefix: 'Već imate račun?',
      toLogin: 'Prijava',
      successConfirm: 'Provjerite inbox i potvrdite e-mail, zatim se prijavite.',
      failed: 'Registracija nije uspjela',
      tabsCoach: 'Coach',
      tabsClient: 'Klijent',
      roleSelectLabel: 'Odaberite ulogu',
    },
    messages: {
      willRedirect: 'Preusmjeravanje...',
    },
  },
};

let currentLang = 'hr'; // default to Croatian for this task; can be toggled by UI later

export function setLang(lang) {
  currentLang = lang === 'hr' ? 'hr' : 'en';
}

export function getLang() {
  return currentLang;
}

function deepGet(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
}

// PUBLIC_INTERFACE
export function t(key) {
  /** Returns localized string for provided key with EN fallback. */
  const hrVal = deepGet(hr, key);
  if (hrVal != null) return hrVal;
  const enVal = deepGet(en, key);
  return enVal != null ? enVal : key;
}

export const dictionaries = { hr, en };
