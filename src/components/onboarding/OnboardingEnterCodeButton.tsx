import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";

const OnboardingEnterCodeButton: React.FC = () => {
  const { pendingTFA, setShowTfaModal } = useOnboarding();

  if (!pendingTFA) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <Button
        onClick={() => setShowTfaModal(true)}
        className="bg-[#AEE3F5]/90 hover:bg-[#AEE3F5] text-black px-4 py-2 rounded-lg shadow-lg font-medium"
      >
        Enter Code
      </Button>
    </motion.div>
  );
};

export default OnboardingEnterCodeButton;