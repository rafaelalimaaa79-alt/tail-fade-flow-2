
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingStep4Props {
  values: string[];
  onSelect: (values: string[]) => void;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ values, onSelect }) => {
  const options = [
    { value: "losing-to-public", label: "Losing to the public" },
    { value: "following-bad-picks", label: "Following bad picks" },
    { value: "too-many-opinions", label: "Too many opinions" },
    { value: "no-tracking", label: "No way to track my record" },
    { value: "dont-know-who-to-trust", label: "I don't know who to trust" }
  ];

  const toggleOption = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value];
    
    onSelect(newValues);
  };

  const handleContinue = () => {
    onSelect(values);
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="w-16 h-16 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-[#AEE3F5]" />
        </div>
        <h2 className="text-2xl font-light text-white mb-3">
          What frustrates you most about betting?
        </h2>
        <p className="text-white/70 text-sm">
          Select all that apply.
        </p>
      </motion.div>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const isSelected = values.includes(option.value);
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => toggleOption(option.value)}
              className={`w-full p-4 rounded-lg border transition-all duration-300 group relative ${
                isSelected
                  ? 'border-[#AEE3F5] bg-[#AEE3F5]/10 shadow-[0_0_15px_rgba(174,227,245,0.3)]'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#AEE3F5]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-base transition-colors ${
                  isSelected ? 'text-[#AEE3F5]' : 'text-white group-hover:text-[#AEE3F5]'
                }`}>
                  {option.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-[#AEE3F5] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-black" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        className="w-full h-12 text-sm bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium shadow-[0_0_15px_rgba(174,227,245,0.4)] hover:shadow-[0_0_25px_rgba(174,227,245,0.6)] transition-all duration-300"
        disabled={values.length === 0}
      >
        Continue
      </Button>
    </div>
  );
};

export default OnboardingStep4;
