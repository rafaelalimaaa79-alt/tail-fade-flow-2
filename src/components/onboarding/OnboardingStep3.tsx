
import React from "react";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";

interface OnboardingStep3Props {
  value: string;
  onSelect: (value: string) => void;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ value, onSelect }) => {
  const options = [
    { value: "absolutely", label: "Absolutely" },
    { value: "never", label: "Never" }
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="w-16 h-16 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingDown className="w-8 h-8 text-[#AEE3F5]" />
        </div>
        <h2 className="text-2xl font-light text-white mb-3">
          Ever faded your buddy's "lock of the week"?
        </h2>
      </motion.div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => onSelect(option.value)}
            className="w-full p-4 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-[#AEE3F5]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(174,227,245,0.3)] group"
          >
            <span className="text-base group-hover:text-[#AEE3F5] transition-colors">
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep3;
