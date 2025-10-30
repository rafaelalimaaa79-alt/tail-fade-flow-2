
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OnboardingStep3Props {
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ name, onNameChange, onNext }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-3">
          WHAT SHOULD WE CALL YOU?
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full bg-gray-900 border border-white/20 rounded-xl px-6 py-5 text-white text-lg placeholder-white/50 focus:outline-none focus:border-[#0066FF]"
        />
      </motion.div>

      <Button
        onClick={onNext}
        disabled={!name.trim()}
        className="w-full h-14 text-lg font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
};

export default OnboardingStep3;
