export const theme = {
  // PUBLIC_INTERFACE
  // Theme tokens used across components
  colors: {
    primary: '#F97316',
    secondary: '#10B981',
    success: '#10B981',
    error: '#EF4444',
    background: '#000000',
    surface: '#1F2937',
    text: '#FFFFFF',
  },
};

/**
 * PUBLIC_INTERFACE
 * applyTheme
 * Applies the theme using data-theme on documentElement for future toggling or extensions.
 */
export function applyTheme(mode = 'dark') {
  // For now, app is dark by default but keeping hook for future user preference.
  document.documentElement.setAttribute('data-theme', mode);
}
