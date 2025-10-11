
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSyncBets } from "@/hooks/useSyncBets";

export const useSignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  // Get sync functionality with 2FA support
  const {
    syncBets,
    isSyncing,
    sharpSportsModal,
    handleModalComplete,
    handleModalClose
  } = useSyncBets();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Check for guest login first - bypass all auth
    if (email.trim() === "Guest1" && password.trim() === "Guest1") {
      console.log("Guest login detected, bypassing auth");
      localStorage.setItem('guestMode', 'true');
      toast.success("Guest login successful");
      navigate('/dashboard');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting to sign in with:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      // If authentication succeeds
      toast.success("Signed in successfully");

      // Trigger auto-sync with 2FA support
      // This will show the SharpSportsModal if 2FA is required
      if (data.session) {
        console.log("Triggering auto-sync on login for user:", data.session.user.id);

        // IMPORTANT: Clear OTP verification on login
        // This ensures 2FA is ALWAYS required when user logs in
        localStorage.removeItem('otpVerifiedAt');
        console.log("Cleared otpVerifiedAt - 2FA will be required on login");

        // Don't await - let it run in background
        // If 2FA is needed, modal will appear automatically
        syncBets().catch(err => {
          console.error("Auto-sync error (non-blocking):", err);
          // Don't block login on sync failure
        });
      }

      // Check if this is the user's first time logging in (no biometric preference set)
      const biometricEnabled = localStorage.getItem('biometricEnabled');
      const supportsBiometrics = 'FaceID' in window || 'TouchID' in window || 'webauthn' in navigator;
      
      if (!biometricEnabled && supportsBiometrics) {
        setShowBiometricPrompt(true);
      } else {
        // Always redirect if biometrics aren't available or already configured
        console.log("Redirecting after successful login to:", from);
        navigate(from);
      }
      
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAccount = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  const closeBiometricPrompt = () => {
    setShowBiometricPrompt(false);
    // Redirect to dashboard when biometric prompt is closed
    console.log("Biometric prompt closed, redirecting to:", from);
    navigate(from);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    from,
    showBiometricPrompt,
    handleSignIn,
    handleCreateAccount,
    handleForgotPassword,
    closeBiometricPrompt,
    // Sync-related state for 2FA modal
    isSyncing,
    sharpSportsModal,
    handleModalComplete,
    handleModalClose
  };
};
