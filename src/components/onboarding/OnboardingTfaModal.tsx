import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "@/contexts/OnboardingContext";

const OnboardingTfaModal: React.FC = () => {
  const {
    pendingTFA,
    showTfaModal,
    setShowTfaModal,
    tfaCode,
    setTfaCode,
    tfaError,
    setTfaError,
    handleTfaSubmit
  } = useOnboarding();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    setTfaCode(digits);
    setTfaError("");
    
    // Auto-submit at 6 digits
    if (digits.length === 6) {
      handleTfaSubmit();
    }
  };

  return (
    <Dialog open={showTfaModal} onOpenChange={setShowTfaModal}>
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-black border border-white/20 max-h-[90vh] overflow-y-auto sm:rounded-t-lg sm:rounded-b-none">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium text-white">
            Enter Verification Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-white/80 text-sm text-center">
            {pendingTFA?.sportsbookName} is sending you a verification code.
          </p>
          
          <Input
            value={tfaCode}
            onChange={handleInputChange}
            placeholder="123456"
            className="h-12 text-center text-lg tracking-widest border-white/20 bg-black/50 focus:border-[#AEE3F5]"
            maxLength={8}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
          />

          {tfaError && (
            <p className="text-red-400 text-sm text-center">{tfaError}</p>
          )}

          <Button
            onClick={handleTfaSubmit}
            disabled={tfaCode.length < 6}
            className="w-full h-12 bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTfaModal;