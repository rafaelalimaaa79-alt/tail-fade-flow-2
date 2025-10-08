import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postAuthSuccessMessage } from "@/utils/ios-bridge";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  biometricEnabled: boolean;
  setBiometricEnabled: (value: boolean) => void;
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
  const navigate = useNavigate();

  useEffect(() => {
    // Store biometric preference when it changes
    localStorage.setItem("biometricEnabled", biometricEnabled.toString());
  }, [biometricEnabled]);

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
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

      // Don't notify iOS for existing sessions, only for new sign-ins
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
