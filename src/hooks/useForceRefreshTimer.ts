import { useState, useEffect } from 'react';

interface UseForceRefreshTimerReturn {
  showModal: boolean;
  onRefresh: () => void;
  onDismiss: () => void;
}

/**
 * Hook to manage the 90-second force refresh timer on the dashboard
 * Shows a non-dismissable modal after 90 seconds to ensure bets are synced
 */
export function useForceRefreshTimer(): UseForceRefreshTimerReturn {
  const [showModal, setShowModal] = useState(false);
  const [hasShownTimer, setHasShownTimer] = useState(false);

  useEffect(() => {
    // Only show timer once per session
    if (hasShownTimer) return;

    // Set timer for 90 seconds
    const timer = setTimeout(() => {
      console.log('90-second force refresh timer triggered');
      setShowModal(true);
      setHasShownTimer(true);
    }, 90000); // 90 seconds

    return () => clearTimeout(timer);
  }, [hasShownTimer]);

  const onRefresh = () => {
    console.log('Force refresh triggered');
    setShowModal(false);
    // The actual refresh will be handled by the parent component
  };

  const onDismiss = () => {
    // Modal is non-dismissable, so this won't be called
    // But we keep it for consistency
    setShowModal(false);
  };

  return {
    showModal,
    onRefresh,
    onDismiss
  };
}

