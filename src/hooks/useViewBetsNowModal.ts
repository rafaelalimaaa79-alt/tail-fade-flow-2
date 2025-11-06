import { useState, useEffect } from 'react';

interface UseViewBetsNowModalReturn {
  showModal: boolean;
  closeModal: () => void;
}

/**
 * Hook to manage the "You're in — View Bets Now" modal that appears after 2FA completes
 * This modal appears in a separate popup after the SharpSportsModal closes
 */
export function useViewBetsNowModal(): UseViewBetsNowModalReturn {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Listen for bets-synced event which fires after 2FA completes
    const handleBetsSynced = () => {
      console.log('Bets synced event received, showing View Bets Now modal');
      setShowModal(true);
    };

    window.addEventListener('bets-synced', handleBetsSynced);

    return () => {
      window.removeEventListener('bets-synced', handleBetsSynced);
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    closeModal
  };
}

