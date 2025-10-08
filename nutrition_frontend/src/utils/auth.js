export const handleAuthError = (error, navigate) => {
  // eslint-disable-next-line no-console
  console.error('Authentication error:', error);
  const msg = (error?.message || '').toLowerCase();

  if (msg.includes('redirect')) {
    navigate('/auth/error?type=redirect', { replace: true });
  } else if (msg.includes('email')) {
    navigate('/auth/error?type=email', { replace: true });
  } else {
    navigate('/auth/error', { replace: true });
  }
};
