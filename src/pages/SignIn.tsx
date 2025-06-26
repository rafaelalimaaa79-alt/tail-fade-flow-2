
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useSignIn } from "@/hooks/useSignIn";
import SignInForm from "@/components/auth/SignInForm";
import BiometricPrompt from "@/components/auth/BiometricPrompt";

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
  
  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          console.log("User already logged in, redirecting to:", from);
          navigate(from);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkUser();
  }, [from, navigate]);

  // Try biometric login if enabled - only on fresh visits, not on logout
  useEffect(() => {
    const tryBiometric = async () => {
      try {
        // Only try biometric if we have it enabled and not coming from a logout or fresh login attempt
        const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
        const comingFromLogout = location.state?.fromLogout;
        const freshLogin = location.state?.freshLogin;
        
        if (biometricEnabled && !comingFromLogout && !freshLogin) {
          await attemptBiometricAuth(from);
        }
      } catch (error) {
        console.error("Error with biometric auth:", error);
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
