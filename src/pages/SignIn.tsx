
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useSignIn } from "@/hooks/useSignIn";
import SignInForm from "@/components/auth/SignInForm";
import BiometricPrompt from "@/components/auth/BiometricPrompt";

// Development mode flag to bypass authentication checks
const BYPASS_AUTH = true; // This should match the flag in ProtectedRoute

const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
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
  } = useSignIn();
  
  const { attemptBiometricAuth } = useBiometricAuth();
  
  // Only check if user is already logged in when not bypassing auth
  useEffect(() => {
    if (BYPASS_AUTH) {
      console.log("SignIn: Authentication bypassed for development, showing sign-in form");
      return;
    }
    
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        console.log("User already logged in, redirecting to:", from);
        navigate(from);
      }
    };
    
    checkUser();
  }, [from, navigate]);

  // Only try biometric login if enabled and not bypassing auth
  useEffect(() => {
    if (BYPASS_AUTH) {
      return;
    }
    
    const tryBiometric = async () => {
      // Only try biometric if we have it enabled and not on a fresh login attempt
      const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
      if (biometricEnabled && !location.state?.freshLogin) {
        await attemptBiometricAuth(from);
      }
    };
    
    tryBiometric();
  }, [attemptBiometricAuth, from, location.state]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12">
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={handleSignIn}
          onCreateAccount={handleCreateAccount}
          onForgotPassword={handleForgotPassword}
        />
      </div>
      
      <BiometricPrompt
        open={showBiometricPrompt}
        redirectPath={from}
        onClose={closeBiometricPrompt}
      />
    </div>
  );
};

export default SignIn;
