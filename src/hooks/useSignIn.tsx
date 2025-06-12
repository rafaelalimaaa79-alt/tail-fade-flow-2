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
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting to sign in with:", { email });
      
      // Special case for the predefined account
      if (email === "wymassey58@yahoo.com") {
        // Check if the user exists
        const { data: existingUser } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (existingUser.user) {
          // User exists and login successful
          toast.success("Signed in successfully");
          
          // Check if this is the user's first login (no biometric preference set)
          const biometricEnabled = localStorage.getItem('biometricEnabled');
          const supportsBiometrics = 'FaceID' in window || 'TouchID' in window || 'webauthn' in navigator;
          
          if (!biometricEnabled && supportsBiometrics) {
            setShowBiometricPrompt(true);
          } else {
            console.log("Redirecting to:", from);
            navigate(from);
          }
          
          return;
        }
        
        // If login fails, try to create the account
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (!signUpError) {
          toast.success("Account created and signed in!");
          // Check if biometrics should be shown
          const supportsBiometrics = 'FaceID' in window || 'TouchID' in window || 'webauthn' in navigator;
          if (supportsBiometrics) {
            setShowBiometricPrompt(true);
          } else {
            console.log("Redirecting after account creation to:", from);
            navigate(from);
          }
        } else {
          throw new Error(signUpError.message);
        }
      } else {
        // Regular login flow for other accounts
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Check if this is the user's first time logging in (no biometric preference set)
        const biometricEnabled = localStorage.getItem('biometricEnabled');
        const supportsBiometrics = 'FaceID' in window || 'TouchID' in window || 'webauthn' in navigator;
        
        if (!biometricEnabled && supportsBiometrics) {
          setShowBiometricPrompt(true);
        } else {
          toast.success("Signed in successfully");
          console.log("Redirecting after regular login to:", from);
          navigate(from);
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
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
    closeBiometricPrompt
  };
};
