
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// Development mode flag to bypass authentication checks
const BYPASS_AUTH = false; // Disabled to enforce authentication

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { attemptBiometricAuth } = useBiometricAuth();
  
  // If bypassing auth, render children immediately without any checks
  if (BYPASS_AUTH) {
    console.log("ProtectedRoute: Authentication bypassed for development");
    return <>{children}</>;
  }

  // Allow guest mode access
  const isGuestMode = localStorage.getItem('guestMode') === 'true';
  if (isGuestMode) {
    console.log("ProtectedRoute: Guest mode access granted");
    return <>{children}</>;
  }
  
  useEffect(() => {
    // Check for guest mode first, before any auth checks
    const isGuestMode = localStorage.getItem('guestMode') === 'true';
    if (isGuestMode) {
      console.log("ProtectedRoute: Guest mode detected, skipping auth checks");
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);

    const checkAuth = async () => {
      try {
        console.log("ProtectedRoute: Checking authentication status");
        // First check if we have a session already
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("ProtectedRoute: No session found, checking biometric options");
          // If biometric authentication is enabled and not already attempted, try it once
          const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';

          if (biometricEnabled && !biometricAttempted) {
            console.log("ProtectedRoute: Attempting biometric authentication");
            setBiometricAttempted(true);
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
          // Check if onboarding is completed
          await checkOnboardingStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        navigate('/signin', { state: { from: location.pathname } });
      } finally {
        setIsVerifying(false);
      }
    };

    const checkOnboardingStatus = async (userId: string) => {
      try {
        console.log("ProtectedRoute: Checking onboarding status for user", { userId });

        // Don't check onboarding status if already on onboarding page
        if (location.pathname === '/onboarding') {
          console.log("ProtectedRoute: Already on onboarding page, skipping check");
          return;
        }

        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('onboarding_completed_at')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        // If onboarding_completed_at is null, redirect to onboarding
        if (!userProfile?.onboarding_completed_at) {
          console.log("ProtectedRoute: Onboarding not completed, redirecting to onboarding page");
          navigate('/onboarding', { state: { from: location.pathname } });
        } else {
          console.log("ProtectedRoute: Onboarding completed");
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    if (!loading) {
      if (!user) {
        console.log("ProtectedRoute: No user in context, checking session");
        checkAuth();
      } else {
        console.log("ProtectedRoute: User found in context", { id: user.id });
        checkOnboardingStatus(user.id);
      }
    }
  }, [user, loading, navigate, location.pathname, attemptBiometricAuth, biometricAttempted]);

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
