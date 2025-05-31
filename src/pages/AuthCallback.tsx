import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZkLogin } from '../hooks/useZkLogin';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleCallback } = useZkLogin();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the id_token from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');

        if (!idToken) {
          throw new Error('No ID token found in URL');
        }

        // Process the callback with the ID token
        await handleCallback(idToken);
        
        // Redirect to dashboard on success
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback failed:', error);
        // Redirect to home on error
        navigate('/');
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Login...</h1>
        <p className="text-gray-400">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
};

export default AuthCallback;
