
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { attemptBiometricAuth } = useBiometricAuth();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have a session already
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If biometric authentication is enabled, try it first
          const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
          
          if (biometricEnabled) {
            const success = await attemptBiometricAuth();
            if (success) {
              setIsVerifying(false);
              return;
            }
          }
          
          // If biometric failed or is not enabled, redirect to signin
          navigate('/signin', { state: { from: location.pathname } });
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        navigate('/signin', { state: { from: location.pathname } });
      } finally {
        setIsVerifying(false);
      }
    };

    if (!loading) {
      if (!user) {
        checkAuth();
      } else {
        setIsVerifying(false);
      }
    }
  }, [user, loading, navigate, location.pathname, attemptBiometricAuth]);

  if (loading || isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-white/70">Verifying authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
