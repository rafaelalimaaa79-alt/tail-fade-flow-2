
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FullscreenNotification from "@/components/FullscreenNotification";
import OnboardingHeader from "./OnboardingHeader";
import UsernameInput from "./UsernameInput";
import UsernamePreview from "./UsernamePreview";
import { validateUsername, checkUsernameAvailability } from "@/utils/usernameValidation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OnboardingStep7Props {
  onComplete: (route: string) => void;
}

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ onComplete }) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [hasPendingTFA, setHasPendingTFA] = useState(false);

  useEffect(() => {
    // Check for pending 2FA initially and set up listener
    const checkPendingTFA = () => {
      const pendingTFA = localStorage.getItem('pendingTFA');
      setHasPendingTFA(!!pendingTFA);
    };
    
    checkPendingTFA();
    
    // Listen for storage changes to update when 2FA is completed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pendingTFA') {
        checkPendingTFA();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case localStorage is changed in the same tab
    const interval = setInterval(checkPendingTFA, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Always update the username first
    setUsername(value);
    
    // Then validate
    const validationError = validateUsername(value);
    setError(validationError);
    
    // Only check availability if there's no validation error and username has content
    if (!validationError && value.length > 8) {
      setIsChecking(true);
      const available = await checkUsernameAvailability(value);
      setIsAvailable(available);
      setIsChecking(false);
    } else {
      setIsAvailable(null);
      setIsChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (hasPendingTFA) {
      // Get sportsbook name from pendingTFA data
      const pendingTFAData = localStorage.getItem('pendingTFA');
      let sportsbookName = "your sportsbook";

      if (pendingTFAData) {
        try {
          const tfaData = JSON.parse(pendingTFAData);
          sportsbookName = tfaData.sportsbookName || "your sportsbook";
        } catch (error) {
          console.error('Error parsing pendingTFA data:', error);
        }
      }

      setError(`Please enter the verification code that ${sportsbookName} texted to you. Use the 'Enter Code' button above to continue.`);
      return;
    }

    if (!username.trim()) {
      setError("You gotta pick a name to enter the Zone.");
      return;
    }

    if (!isAvailable) {
      setError("Please choose an available username");
      return;
    }

    // Store username in onboarding data
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    onboardingData.username = username;
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));

    // Save username to database (user_profiles table)
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user found');
        toast.error('Not authenticated. Please sign in again.');
        return;
      }

      console.log('Saving username to database:', username);

      // Update or insert user profile with username and mark onboarding as completed
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          username: username,
          onboarding_completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Error saving username to database:', upsertError);
        console.error('Error code:', upsertError.code);
        console.error('Error message:', upsertError.message);
        toast.error('Failed to save username. Please try again.');
        return;
      }

      console.log('Username saved successfully to database');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to save username. Please try again.');
      return;
    }

    // Show the notification
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    onComplete('/did-you-know');
  };

  return (
    <>
      <div className="text-center px-2 h-full flex flex-col justify-center">
        <OnboardingHeader />

        <div className="space-y-4 flex-1 flex flex-col justify-center">
          <UsernameInput
            username={username}
            isChecking={isChecking}
            isAvailable={isAvailable}
            error={error}
            onUsernameChange={handleUsernameChange}
          />

          <UsernamePreview username={username} isAvailable={isAvailable} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="pt-4 pb-16"
          >
            <Button
              onClick={handleSubmit}
              disabled={!username || !isAvailable || isChecking || hasPendingTFA}
              className={`w-full h-11 text-base font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 ${
                hasPendingTFA 
                  ? 'bg-gray-600 hover:bg-gray-600 text-gray-300' 
                  : 'bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black'
              }`}
            >
              {hasPendingTFA ? "Enter Verification Code" : "Lock In Username"}
            </Button>
          </motion.div>
        </div>
      </div>

      <FullscreenNotification 
        isOpen={showNotification}
        message={`YOU'RE IN! Welcome @${username}!`}
        variant="tail"
        onClose={handleNotificationClose}
        bettorName={username}
        betDescription="the FadeZone!"
        autoCloseAfter={4000}
      />
    </>
  );
};

export default OnboardingStep7;
