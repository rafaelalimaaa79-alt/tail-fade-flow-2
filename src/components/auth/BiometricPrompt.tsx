
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
    toast.success("Face ID enabled for quick access");
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
          <DialogTitle className="text-center text-xl font-medium">Enable Face ID for Quick Access</DialogTitle>
          <DialogDescription className="text-center text-white/80 leading-relaxed">
            Skip the login screen next time. Use Face ID to unlock FadeZone instantly.<br />
            It's secure, private, and totally optional.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-8">
          <div className="relative">
            <Fingerprint className="h-20 w-20 text-[#AEE3F5] animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-[#AEE3F5]/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-[#AEE3F5]/50" />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          <Button 
            type="button"
            className="w-full h-12 bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium rounded-xl shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] transition-all duration-300"
            onClick={handleEnableBiometrics}
          >
            ✅ Turn On Face ID
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="w-full h-12 border-white/20 text-white/80 hover:border-[#AEE3F5]/50 hover:bg-[#AEE3F5]/5 transition-all duration-300"
            onClick={handleSkipBiometrics}
          >
            ❌ Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricPrompt;
