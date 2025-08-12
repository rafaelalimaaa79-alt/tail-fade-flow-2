import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FloatingSyncButtonProps {
  className?: string;
  onSync?: () => Promise<void> | void;
}

const FloatingSyncButton: React.FC<FloatingSyncButtonProps> = ({ className, onSync }) => {
  const [spinning, setSpinning] = useState(false);

  const handleClick = async () => {
    try {
      setSpinning(true);
      toast.message("Refreshing bets...");
      if (onSync) {
        await onSync();
      } else {
        // Simulate a short refresh for UI feedback only
        await new Promise((r) => setTimeout(r, 1200));
      }
      toast.success("Bets refreshed");
    } catch (e) {
      toast.error("Refresh failed");
      console.error(e);
    } finally {
      setSpinning(false);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      className={cn(
        "fixed bottom-24 right-4 z-50", // sits above BottomNav
        className
      )}
      aria-label="Drag to reposition the sync button"
    >
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-xl hover:shadow-2xl"
        onClick={handleClick}
        aria-label="Sync bets"
      >
        <RotateCw className={cn("h-5 w-5", spinning && "animate-spin")} />
      </Button>
    </motion.div>
  );
};

export default FloatingSyncButton;
