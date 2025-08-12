import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { triggerHaptic, triggerRefreshHaptic } from "@/utils/haptic-feedback";

interface FloatingSyncButtonProps {
  className?: string;
  onSync?: () => Promise<void> | void;
}

const FloatingSyncButton: React.FC<FloatingSyncButtonProps> = ({ className, onSync }) => {
  const [spinning, setSpinning] = useState(false);

  const handleClick = async () => {
    try {
      triggerHaptic('impactMedium'); // Initial press feedback
      setSpinning(true);
      toast.message("Refreshing bets...");
      
      if (onSync) {
        await onSync();
      } else {
        // Simulate a short refresh for UI feedback only
        await new Promise((r) => setTimeout(r, 1200));
      }
      
      toast.success("Bets refreshed");
      triggerRefreshHaptic('success'); // Success feedback
    } catch (e) {
      toast.error("Refresh failed");
      triggerRefreshHaptic('error'); // Error feedback
      console.error(e);
    } finally {
      setSpinning(false);
    }
  };

  return (
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
          "bg-icy text-background hover:bg-icy/90"
        )}
        onClick={handleClick}
        aria-label="Sync bets"
      >
        <RotateCw className={cn("h-5 w-5", spinning && "animate-spin")} />
      </Button>
    </div>
  );
};

export default FloatingSyncButton;
