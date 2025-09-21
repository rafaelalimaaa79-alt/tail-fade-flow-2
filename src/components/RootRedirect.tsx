import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RootRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // User is not authenticated, redirect to signin
        navigate('/signin', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
};

export default RootRedirect;