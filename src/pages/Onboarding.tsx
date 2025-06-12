import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingStep7 from "@/components/onboarding/OnboardingStep7";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    navigate('/connect-sportsbooks');
  };
  
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md">
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="mt-8">
            {currentStep === 1 && <OnboardingStep1 />}
            {currentStep === 2 && <OnboardingStep2 />}
            {currentStep === 3 && <OnboardingStep3 />}
            {currentStep === 4 && <OnboardingStep4 />}
            {currentStep === 5 && <OnboardingStep5 />}
            {currentStep === 6 && <OnboardingStep6 />}
            {currentStep === 7 && <OnboardingStep7 />}
          </div>
          
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button 
                onClick={handlePrevious}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            <Button 
              onClick={currentStep === totalSteps ? handleGetStarted : handleNext}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {currentStep === totalSteps ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
