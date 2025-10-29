import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postAuthSuccessMessage } from "@/utils/ios-bridge";
import { safeRemoveItem } from "@/utils/localStorage";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  biometricEnabled: boolean;
  setBiometricEnabled: (value: boolean) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(() => {
    const stored = localStorage.getItem("biometricEnabled");
    return stored === "true";
  });
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Store biometric preference when it changes
    localStorage.setItem("biometricEnabled", biometricEnabled.toString());
  }, [biometricEnabled]);

  // Check if onboarding is completed
  const checkOnboardingStatus = useCallback(async (userId: string) => {
    try {
      console.log("AuthContext: Checking onboarding status for user", { userId });

      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error fetching user profile:', error);
        return;
      }

      const isCompleted = !!userProfile?.onboarding_completed_at;
      console.log("AuthContext: Onboarding status:", { isCompleted });
      setOnboardingCompleted(isCompleted);

      // If onboarding not completed, redirect to connect-sportsbooks
      if (!isCompleted) {
        console.log("AuthContext: Onboarding not completed, redirecting to connect-sportsbooks");
        navigate('/connect-sportsbooks');
      }
    } catch (error) {
      console.error('AuthContext: Error checking onboarding status:', error);
    }
  }, [navigate]);

  useEffect(() => {
    // Track if this is the initial session check to avoid triggering sync on tab visibility changes
    let isInitialLoad = true;

    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      // Dispatch email verification event if user just verified email
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        console.log("Email verified! Dispatching emailVerified event");
        window.dispatchEvent(new CustomEvent('emailVerified', {
          detail: { user: session.user }
        }));
      }

      // Check onboarding status and redirect if needed when user logs in
      if (event === "SIGNED_IN" && session?.user && !isInitialLoad) {
        console.log("AuthContext: User logged in, checking onboarding status");
        checkOnboardingStatus(session.user.id);

        // Notify iOS app of successful authentication
        console.log("success-signIn-postAuthSuccessMessage", session?.user);
        postAuthSuccessMessage({
          user: session.user,
          type: "signIn",
        });
      }

      if (event === "SIGNED_OUT") {
        // Clear any local state that should be reset on sign out
        setBiometricEnabled(false);
        setOnboardingCompleted(false);
        safeRemoveItem('otpVerifiedAt');
        safeRemoveItem('lastSyncTime');
        safeRemoveItem('pendingLoginSync'); // Clear pending sync flag
        console.log("Cleared OTP verification and sync state on logout");

        // Always redirect to signin on sign out
        console.log("User signed out, redirecting to signin");
        navigate("/signin");
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Mark initial load as complete
      isInitialLoad = false;

      // Don't notify iOS for existing sessions, only for new sign-ins
    });

    return () => subscription.unsubscribe();
  }, [navigate, checkOnboardingStatus]);

  const signOut = useCallback(async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      // The auth state change listener will handle the redirect
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
      // Force redirect to signin even if there's an error
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signOut,
        biometricEnabled,
        setBiometricEnabled,
        onboardingCompleted,
        setOnboardingCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
