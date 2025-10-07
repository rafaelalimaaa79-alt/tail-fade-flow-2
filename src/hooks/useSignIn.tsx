
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useSignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [showTfaModal, setShowTfaModal] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [tfaError, setTfaError] = useState("");
  const [pendingSession, setPendingSession] = useState<any>(null);
  
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
        // Check if error is MFA required
        if (error.message?.includes('MFA') || error.message?.includes('factor')) {
          setPendingSession(data);
          setShowTfaModal(true);
          toast.info("Please enter your verification code");
          return;
        }
        toast.error(error.message);
        return;
      }
      
      // If authentication succeeds
      await completeSyncAndRedirect(data.session);
      
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
  
  const completeSyncAndRedirect = async (session: any) => {
    toast.success("Signed in successfully");
    
    // Sync bets from SharpSports automatically on login
    if (session) {
      try {
        toast.message("Syncing your bets...");
        const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-bets', {
          body: { 
            internalId: session.user.id, 
            userId: session.user.id 
          }
        });
        
        if (syncError) {
          console.error("Error syncing bets:", syncError);
          toast.warning("Bets sync failed, please refresh manually");
        } else {
          console.log("Bets synced successfully:", syncData);
          toast.success("Bets synced successfully");
        }
      } catch (syncError) {
        console.error("Error syncing bets:", syncError);
        // Don't block login on sync failure
      }
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
  };

  const handleTfaSubmit = async () => {
    if (!tfaCode || tfaCode.length < 6) {
      setTfaError("Please enter a valid 6-digit code");
      return;
    }
    
    setLoading(true);
    setTfaError("");
    
    try {
      // Verify MFA code
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: tfaCode,
        type: 'email'
      });
      
      if (error) {
        setTfaError("Invalid verification code. Please try again.");
        setLoading(false);
        return;
      }
      
      // Close TFA modal
      setShowTfaModal(false);
      setTfaCode("");
      
      // Complete sync and redirect
      await completeSyncAndRedirect(data.session);
      
    } catch (error: any) {
      console.error("TFA verification error:", error);
      setTfaError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
    showTfaModal,
    tfaCode,
    setTfaCode,
    tfaError,
    handleSignIn,
    handleCreateAccount,
    handleForgotPassword,
    handleTfaSubmit,
    closeBiometricPrompt
  };
};
