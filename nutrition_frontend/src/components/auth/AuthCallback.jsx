import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { handleAuthError } from '../../utils/auth';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const supabase = getSupabaseClient();
    const handleAuthCallback = async () => {
      try {
        // For supabase-js v2, handle fragments if present
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (error) {
          handleAuthError(error, navigate);
          return;
        }
        if (data?.session) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/auth/login', { replace: true });
        }
      } catch (e) {
        handleAuthError(e, navigate);
      }
    };
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="container">
      <div className="card">Processing authentication...</div>
    </div>
  );
}
