import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHaptic, triggerRefreshHaptic } from "@/utils/haptic-feedback";
import { useSyncBets } from "@/hooks/useSyncBets";
import { SharpSportsModal } from "@/components/SharpSportsModal";

interface FloatingSyncButtonProps {
  className?: string;
}

const FloatingSyncButton: React.FC<FloatingSyncButtonProps> = ({ className }) => {
  const {
    syncBets,
    isSyncing,
    sharpSportsModal,
    handleModalComplete,
    handleModalClose
  } = useSyncBets();

  const handleClick = async () => {
    triggerHaptic('impactMedium');
    await syncBets();

    // Haptic feedback is now handled by the hook's toast messages
    if (!isSyncing) {
      triggerRefreshHaptic('success');
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-24 right-4 z-50", // sits above BottomNav
          className
        )}
        aria-label="Sync button"
      >
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "rounded-full shadow-xl hover:shadow-2xl border border-white/10",
            "bg-icy text-background hover:bg-icy/90",
            isSyncing && "opacity-75"
          )}
          onClick={handleClick}
          disabled={isSyncing}
          aria-label="Sync bets"
        >
          <RotateCw className={cn("h-5 w-5", isSyncing && "animate-spin")} />
        </Button>
      </div>

      {sharpSportsModal && (
        <SharpSportsModal
          url={sharpSportsModal.url}
          title={sharpSportsModal.title}
          message={sharpSportsModal.message}
          onComplete={handleModalComplete}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default FloatingSyncButton;
