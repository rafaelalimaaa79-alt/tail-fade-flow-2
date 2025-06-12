
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

export interface OnboardingData {
  unitSize: string;
  bettingFrequency: string;
  fadingExperience: string;
  frustrations: string[];
  helpWith: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    unitSize: "",
    bettingFrequency: "",
    fadingExperience: "",
    frustrations: [],
    helpWith: ""
  });

  const totalSteps = 6;

  const updateData = (field: keyof OnboardingData, value: string | string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const completeOnboarding = (route: string) => {
    // Store onboarding data in localStorage for personalization
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('onboardingCompleted', 'true');
    
    toast.success("Welcome to FadeZone! 🎉");
    navigate(route);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            value={onboardingData.unitSize}
            onSelect={(value) => {
              updateData('unitSize', value);
              nextStep();
            }}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            value={onboardingData.bettingFrequency}
            onSelect={(value) => {
              updateData('bettingFrequency', value);
              nextStep();
            }}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            value={onboardingData.fadingExperience}
            onSelect={(value) => {
              updateData('fadingExperience', value);
              nextStep();
            }}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            values={onboardingData.frustrations}
            onSelect={(values) => {
              updateData('frustrations', values);
              nextStep();
            }}
          />
        );
      case 5:
        return (
          <OnboardingStep5
            value={onboardingData.helpWith}
            onSelect={(value) => {
              updateData('helpWith', value);
              nextStep();
            }}
          />
        );
      case 6:
        return (
          <OnboardingStep6
            onComplete={completeOnboarding}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-md"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
