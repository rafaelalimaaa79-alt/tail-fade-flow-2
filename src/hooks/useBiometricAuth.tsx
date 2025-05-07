
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useBiometricAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { biometricEnabled, user } = useAuth();
  const navigate = useNavigate();

  // Simulated biometric authentication since web browsers don't directly support Face ID/Touch ID
  const authenticateWithBiometrics = async (): Promise<boolean> => {
    setIsAuthenticating(true);
    
    try {
      // In a real implementation, this would use the WebAuthn API
      // For now, we'll simulate successful authentication
      
      // Simulate a brief delay for the biometric check
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Attempting biometric authentication");
      
      // Check if we have a valid session token in storage
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // If we have a session, biometric authentication is successful
        console.log("Biometric authentication successful - valid session found");
        toast.success('Biometric authentication successful');
        return true;
      } else {
        // If no session exists, biometric authentication failed
        console.log("Biometric authentication failed - no valid session");
        toast.error('Biometric authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      toast.error('Biometric authentication error');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Function that attempts biometric auth and redirects on success
  const attemptBiometricAuth = async (redirectPath = '/') => {
    if (biometricEnabled && !user) {
      console.log("Attempting biometric authentication for redirect to:", redirectPath);
      const success = await authenticateWithBiometrics();
      if (success) {
        console.log("Biometric auth successful, redirecting to:", redirectPath);
        navigate(redirectPath);
        return true;
      }
    }
    return false;
  };

  return {
    authenticateWithBiometrics,
    attemptBiometricAuth,
    isAuthenticating
  };
};
