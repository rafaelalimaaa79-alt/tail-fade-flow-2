
import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";

const OnboardingHeader: React.FC = () => {
  const { pendingTFA, setShowTfaModal } = useOnboarding();

  return (
    <>
      {pendingTFA && (
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
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-12 h-12 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="w-6 h-6 text-[#AEE3F5]" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-light text-white mb-4"
        >
          Pick your <span className="text-[#AEE3F5] font-medium">NoShot</span> username
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2 mb-4 leading-relaxed"
        >
          <p className="text-white/80 text-sm">
            This is the name <span className="font-semibold text-white">everyone will see</span>.
          </p>
          <div className="text-white/70 text-sm space-y-1">
            <p>If you're <span className="font-semibold text-white/90">sharp</span>, you won't care who sees it.</p>
            <p>If you're <span className="font-semibold text-white/90">cold</span>… maybe go anonymous.</p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default OnboardingHeader;
