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
        y: 0
      }}
      transition={{ 
        duration: 0.5
      }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-transparent"
      style={{ background: 'transparent' }}
    >
      <div
        onClick={() => setShowTfaModal(true)}
        className="cursor-pointer inline-flex items-center justify-center text-black px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #AEE3F5, #85D4F0)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 0 25px rgba(174, 227, 245, 0.7), 0 0 50px rgba(174, 227, 245, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
        }}
      >
        <span className="relative z-10">Enter Code</span>
      </div>
    </motion.div>
  );
};

export default OnboardingEnterCodeButton;