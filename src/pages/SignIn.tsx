
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useSignIn } from "@/hooks/useSignIn";
import SignInForm from "@/components/auth/SignInForm";
import BiometricPrompt from "@/components/auth/BiometricPrompt";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    showTfaModal,
    tfaCode,
    setTfaCode,
    tfaError,
    handleSignIn, 
    handleCreateAccount, 
    handleForgotPassword,
    handleTfaSubmit,
    closeBiometricPrompt
  } = useSignIn();
  
  const { attemptBiometricAuth } = useBiometricAuth();
  
  // Only redirect if user is logged in AND we have a specific redirect location that's not root
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        // Only redirect if:
        // 1. User is logged in
        // 2. We have a specific "from" location 
        // 3. The "from" location is not the root '/' or '/signin'
        // 4. We're not currently on the root path
        if (data.session?.user && from && from !== '/' && from !== '/signin' && location.pathname !== '/') {
          console.log("User already logged in, redirecting to:", from);
          navigate(from);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    // Only check and potentially redirect if we have a valid redirect location
    if (from && from !== '/' && from !== '/signin' && location.pathname !== '/') {
      checkUser();
    }
  }, [from, navigate, location.pathname]);

  // Try biometric login if enabled - but not on root page visits
  useEffect(() => {
    const tryBiometric = async () => {
      try {
        const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
        const comingFromLogout = location.state?.fromLogout;
        const freshLogin = location.state?.freshLogin;
        const isRootPage = location.pathname === '/';
        
        // Don't try biometric if:
        // - Coming from logout
        // - Fresh login attempt
        // - Visiting root page directly
        // - No specific redirect location
        if (biometricEnabled && !comingFromLogout && !freshLogin && !isRootPage && from && from !== '/') {
          await attemptBiometricAuth(from);
        }
      } catch (error) {
        console.error("Error with biometric auth:", error);
      }
    };
    
    tryBiometric();
  }, [attemptBiometricAuth, from, location.state, location.pathname]);

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
      
      <Dialog open={showTfaModal} onOpenChange={() => {}}>
        <DialogContent className="w-[90vw] max-w-md mx-auto bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium">
              Enter Verification Code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-muted-foreground text-sm text-center">
              Please enter the verification code sent to your device.
            </p>
            
            <Input
              value={tfaCode}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                setTfaCode(digits);
                if (digits.length === 6) {
                  handleTfaSubmit();
                }
              }}
              placeholder="123456"
              className="h-12 text-center text-lg tracking-widest"
              maxLength={8}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
            />

            {tfaError && (
              <p className="text-destructive text-sm text-center">{tfaError}</p>
            )}

            <Button
              onClick={handleTfaSubmit}
              disabled={tfaCode.length < 6 || loading}
              className="w-full h-12"
            >
              {loading ? "Verifying..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignIn;
