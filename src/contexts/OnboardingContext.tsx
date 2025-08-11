import React, { createContext, useContext, useState, useEffect } from 'react';

interface PendingTFA {
  accountIdTemp: string;
  sportsbookName: string;
}

interface OnboardingContextType {
  pendingTFA: PendingTFA | null;
  setPendingTFA: (tfa: PendingTFA | null) => void;
  showTfaModal: boolean;
  setShowTfaModal: (show: boolean) => void;
  tfaCode: string;
  setTfaCode: (code: string) => void;
  tfaError: string;
  setTfaError: (error: string) => void;
  handleTfaSubmit: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingTFA, setPendingTFA] = useState<PendingTFA | null>(null);
  const [showTfaModal, setShowTfaModal] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [tfaError, setTfaError] = useState("");

  useEffect(() => {
    const pending = localStorage.getItem('pendingTFA');
    if (pending) {
      try {
        setPendingTFA(JSON.parse(pending));
      } catch (error) {
        console.error('Error parsing pendingTFA:', error);
        localStorage.removeItem('pendingTFA');
      }
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

  const value = {
    pendingTFA,
    setPendingTFA,
    showTfaModal,
    setShowTfaModal,
    tfaCode,
    setTfaCode,
    tfaError,
    setTfaError,
    handleTfaSubmit
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};