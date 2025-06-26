
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FullscreenNotification from "@/components/FullscreenNotification";
import OnboardingHeader from "./OnboardingHeader";
import UsernameInput from "./UsernameInput";
import UsernamePreview from "./UsernamePreview";
import { validateUsername, checkUsernameAvailability } from "@/utils/usernameValidation";

interface OnboardingStep7Props {
  onComplete: (route: string) => void;
}

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ onComplete }) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    setUsername(value);
    
    if (value.length > 0) {
      setIsChecking(true);
      const available = await checkUsernameAvailability(value);
      setIsAvailable(available);
      setIsChecking(false);
    } else {
      setIsAvailable(null);
    }
  };

  const handleSubmit = () => {
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
              disabled={!username || !isAvailable || isChecking}
              className="w-full h-11 text-base bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
            >
              Lock In Username
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
