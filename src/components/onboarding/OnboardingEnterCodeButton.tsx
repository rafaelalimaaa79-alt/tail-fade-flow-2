import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";

const OnboardingEnterCodeButton: React.FC = () => {
  const { pendingTFA, setShowTfaModal } = useOnboarding();
  const [forceShow, setForceShow] = useState(false);

  // Also check localStorage directly as backup
  useEffect(() => {
    const pending = localStorage.getItem('pendingTFA');
    if (pending && !pendingTFA) {
      setForceShow(true);
    }
  }, [pendingTFA]);

  if (!pendingTFA && !forceShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -50 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        boxShadow: [
          "0 0 20px rgba(174, 227, 245, 0.4)",
          "0 0 30px rgba(174, 227, 245, 0.6)", 
          "0 0 20px rgba(174, 227, 245, 0.4)"
        ]
      }}
      transition={{ 
        duration: 0.5,
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <Button
        onClick={() => setShowTfaModal(true)}
        className="bg-gradient-to-r from-[#AEE3F5] to-[#85D4F0] hover:from-[#85D4F0] hover:to-[#AEE3F5] text-black px-6 py-3 rounded-full shadow-2xl font-semibold border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{
          boxShadow: "0 0 25px rgba(174, 227, 245, 0.7), 0 0 50px rgba(174, 227, 245, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          background: "linear-gradient(135deg, #AEE3F5, #85D4F0)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <span className="relative z-10">Enter Code</span>
      </Button>
    </motion.div>
  );
};

export default OnboardingEnterCodeButton;