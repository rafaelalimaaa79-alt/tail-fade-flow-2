
import React from "react";
import { motion } from "framer-motion";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="flex flex-col items-center pt-8 pb-4">
      <div className="flex space-x-2 mb-3">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index + 1 <= currentStep 
                ? 'bg-[#AEE3F5] shadow-[0_0_8px_rgba(174,227,245,0.6)]' 
                : 'bg-white/20'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: index + 1 === currentStep ? 1.2 : 1,
              transition: { duration: 0.2 }
            }}
          />
        ))}
      </div>
      <p className="text-white/60 text-sm">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
};

export default OnboardingProgress;
