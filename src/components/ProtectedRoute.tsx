
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// Development mode flag to bypass authentication checks
const BYPASS_AUTH = true; // Enabled to allow direct access to home page

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isVerifying, setIsVerifying] = useState(!BYPASS_AUTH);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { attemptBiometricAuth } = useBiometricAuth();
  
  useEffect(() => {
    // If we're bypassing authentication, don't perform any checks
    if (BYPASS_AUTH) {
      console.log("ProtectedRoute: Authentication bypassed for development");
      setIsVerifying(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        console.log("ProtectedRoute: Checking authentication status");
        // First check if we have a session already
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("ProtectedRoute: No session found, checking biometric options");
          // If biometric authentication is enabled, try it first
          const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
          
          if (biometricEnabled) {
            console.log("ProtectedRoute: Attempting biometric authentication");
            const success = await attemptBiometricAuth();
            if (success) {
              console.log("ProtectedRoute: Biometric authentication successful");
              setIsVerifying(false);
              return;
            }
            console.log("ProtectedRoute: Biometric authentication failed");
          }
          
          // If biometric failed or is not enabled, redirect to signin
          console.log("ProtectedRoute: Redirecting to signin page", { from: location.pathname });
          navigate('/signin', { state: { from: location.pathname } });
        } else {
          console.log("ProtectedRoute: Valid session found");
          // Check if session is older than 1 minute
          const sessionTime = new Date(session.expires_at ? session.expires_at * 1000 : Date.now());
          const currentTime = new Date();
          const timeDiff = currentTime.getTime() - (sessionTime.getTime() - (session.expires_in || 3600) * 1000);
          
          // If session is older than 1 minute (60000 ms), require re-auth
          if (timeDiff > 60000) {
            console.log("ProtectedRoute: Session expired (1 minute timeout), redirecting to signin");
            await supabase.auth.signOut();
            navigate('/signin', { state: { from: location.pathname } });
            return;
          }
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
        console.log("ProtectedRoute: No user in context, checking session");
        checkAuth();
      } else {
        console.log("ProtectedRoute: User found in context", { id: user.id });
        setIsVerifying(false);
      }
    }
  }, [user, loading, navigate, location.pathname, attemptBiometricAuth]);

  // Auto-logout after 1 minute of inactivity
  useEffect(() => {
    if (BYPASS_AUTH || !user) return;

    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        console.log("ProtectedRoute: Auto-logout due to inactivity");
        await supabase.auth.signOut();
        navigate('/signin');
      }, 60000); // 1 minute
    };

    // Reset timeout on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const resetTimeoutHandler = () => resetTimeout();

    events.forEach(event => {
      document.addEventListener(event, resetTimeoutHandler, true);
    });

    resetTimeout(); // Initial timeout

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutHandler, true);
      });
    };
  }, [user, navigate]);

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
