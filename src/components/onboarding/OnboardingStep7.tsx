
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OnboardingStep7Props {
  onComplete: (route: string) => void;
}

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ onComplete }) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  // Simulate username availability check
  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock some taken usernames for demo
    const takenUsernames = ["coldpublic", "publicfader", "sharps", "admin", "fadezone"];
    const available = !takenUsernames.includes(usernameToCheck.toLowerCase());
    
    setIsAvailable(available);
    setIsChecking(false);
  };

  const validateUsername = (value: string) => {
    // Only allow letters, numbers, and underscores
    const validPattern = /^[a-zA-Z0-9_]*$/;
    
    if (!validPattern.test(value)) {
      setError("Only letters, numbers, and underscores allowed");
      return false;
    }
    
    if (value.length > 20) {
      setError("Username must be 20 characters or less");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (validateUsername(value)) {
      setUsername(value);
      if (value.length > 0) {
        checkUsernameAvailability(value);
      } else {
        setIsAvailable(null);
      }
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
    
    onComplete('/');
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <div className="w-5 h-5 border-2 border-[#AEE3F5] border-t-transparent rounded-full animate-spin" />;
    }
    if (isAvailable === true) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (isAvailable === false) {
      return <X className="w-5 h-5 text-red-400" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (isChecking) return "Checking...";
    if (isAvailable === true) return "✅ Available";
    if (isAvailable === false) return "❌ Taken";
    return "";
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <User className="w-10 h-10 text-[#AEE3F5]" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-light text-white mb-4"
        >
          Pick your <span className="text-[#AEE3F5]">FadeZone</span> name
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-sm mb-2"
        >
          This is how you'll show up in the app. Want to stay anonymous? Go with something funny, weird, or completely made up. No real names required.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/50 text-xs mb-8"
        >
          Example names: @PublicFader, @ColdFadeKing, @SharpUntilSunday
        </motion.p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full h-14 text-base bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-[#AEE3F5]/50 focus:border-[#AEE3F5]/50 shadow-[0_0_20px_rgba(174,227,245,0.1)] focus:shadow-[0_0_30px_rgba(174,227,245,0.3)] transition-all duration-300"
              maxLength={20}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getStatusIcon()}
            </div>
          </div>
          
          {(isAvailable !== null || isChecking) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm"
            >
              <span className={`
                ${isAvailable === true ? 'text-green-400' : 
                  isAvailable === false ? 'text-red-400' : 
                  'text-white/60'}
              `}>
                {getStatusText()}
              </span>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {username && isAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-4 bg-white/5 border border-white/10 rounded-lg"
          >
            <p className="text-white/60 text-xs mb-2">Preview:</p>
            <p className="text-white text-sm">
              <span className="text-[#AEE3F5]">@{username}</span> just faded ColdHands88
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!username || !isAvailable || isChecking}
            className="w-full h-14 text-base bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
          >
            Lock In Username
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStep7;
