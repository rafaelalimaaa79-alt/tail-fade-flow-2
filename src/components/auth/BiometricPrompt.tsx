
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Fingerprint } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BiometricPromptProps {
  open: boolean;
  redirectPath: string;
  onClose: () => void;
}

const BiometricPrompt: React.FC<BiometricPromptProps> = ({ open, redirectPath, onClose }) => {
  const navigate = useNavigate();

  const handleEnableBiometrics = () => {
    localStorage.setItem('biometricEnabled', 'true');
    toast.success("Biometric authentication enabled");
    console.log("Redirecting after enabling biometrics to:", redirectPath);
    navigate(redirectPath);
    onClose();
  };
  
  const handleSkipBiometrics = () => {
    localStorage.setItem('biometricEnabled', 'false');
    console.log("Redirecting after skipping biometrics to:", redirectPath);
    navigate(redirectPath);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-background border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">Enable Biometric Login</DialogTitle>
          <DialogDescription className="text-center">
            Want to sign in with {('FaceID' in window) ? 'Face ID' : 'Fingerprint'} next time?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-6">
          <Fingerprint className="h-20 w-20 text-primary animate-pulse-heartbeat" />
        </div>
        
        <DialogFooter className="flex flex-row justify-center gap-4 sm:justify-center">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleSkipBiometrics}
          >
            Not Now
          </Button>
          <Button 
            type="button"
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleEnableBiometrics}
          >
            Yes, Enable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricPrompt;
