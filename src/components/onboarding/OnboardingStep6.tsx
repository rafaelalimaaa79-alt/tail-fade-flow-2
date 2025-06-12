
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingStep6Props {
  onComplete: (route: string) => void;
}

const OnboardingStep6: React.FC<OnboardingStep6Props> = ({ onComplete }) => {
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
          <Sparkles className="w-10 h-10 text-[#AEE3F5]" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-light text-white mb-4"
        >
          Ready to see your first <span className="text-[#AEE3F5]">smart fade</span>?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-sm mb-8"
        >
          We've customized FadeZone based on your preferences. Let's get started!
        </motion.p>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => onComplete('/')}
            className="w-full h-14 text-base bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] transition-all duration-300"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Yes, show me a cold bettor
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => onComplete('/trends')}
            variant="outline"
            className="w-full h-12 text-sm border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Not yet, let me explore first
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStep6;
