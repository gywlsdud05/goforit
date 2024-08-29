import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.client';
import useAuthStore from '../store/useAuthStore';

const AuthCallback = () => {
  const { setUser, setError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          setUser(data.session.user);
          navigate('/DuckFundingHome');
        } else {
          throw new Error('No session found');
        }
      } catch (error) {
        console.error('Auth callback error:', error.message);
        setError(error.message);
        navigate('/LoginPage');
      }
    };

    handleAuthCallback();
  }, [setUser, setError, navigate]);

  return <div>Processing login...</div>;
};

export default AuthCallback;