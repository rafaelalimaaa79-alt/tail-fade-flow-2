
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const OnboardingHeader: React.FC = () => {
  const [showTfaModal, setShowTfaModal] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [tfaError, setTfaError] = useState("");
  const [pendingTFA, setPendingTFA] = useState<any>(null);

  useEffect(() => {
    const pending = localStorage.getItem('pendingTFA');
    if (pending) {
      setPendingTFA(JSON.parse(pending));
    }
  }, []);

  const handleTfaSubmit = async () => {
    if (!tfaCode || tfaCode.length < 6) return;
    
    try {
      // Simulate TFA submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear pending TFA and close modal
      localStorage.removeItem('pendingTFA');
      setPendingTFA(null);
      setShowTfaModal(false);
      setTfaCode("");
      setTfaError("");
    } catch (error) {
      setTfaError("Invalid code. Please try again.");
    }
  };

  return (
    <>
      {pendingTFA && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Button
            onClick={() => setShowTfaModal(true)}
            className="bg-[#AEE3F5]/90 hover:bg-[#AEE3F5] text-black px-4 py-2 rounded-lg shadow-lg font-medium"
          >
            Enter Code
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-12 h-12 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="w-6 h-6 text-[#AEE3F5]" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-light text-white mb-4"
        >
          Pick your <span className="text-[#AEE3F5] font-medium">NoShot</span> username
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2 mb-4 leading-relaxed"
        >
          <p className="text-white/80 text-sm">
            This is the name <span className="font-semibold text-white">everyone will see</span>.
          </p>
          <div className="text-white/70 text-sm space-y-1">
            <p>If you're <span className="font-semibold text-white/90">sharp</span>, you won't care who sees it.</p>
            <p>If you're <span className="font-semibold text-white/90">cold</span>… maybe go anonymous.</p>
          </div>
        </motion.div>
      </motion.div>

      <Dialog open={showTfaModal} onOpenChange={setShowTfaModal}>
        <DialogContent className="sm:max-w-md bg-background border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium">
              Enter Verification Code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-white/80 text-sm text-center">
              {pendingTFA?.sportsbookName} is sending you a verification code.
            </p>
            
            <Input
              value={tfaCode}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                setTfaCode(digits);
                setTfaError("");
                if (digits.length === 6) {
                  handleTfaSubmit();
                }
              }}
              placeholder="123456"
              className="h-12 text-center text-lg tracking-widest border-white/20 bg-black/50 focus:border-[#AEE3F5]"
              maxLength={8}
              inputMode="numeric"
              autoComplete="one-time-code"
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
    </>
  );
};

export default OnboardingHeader;
