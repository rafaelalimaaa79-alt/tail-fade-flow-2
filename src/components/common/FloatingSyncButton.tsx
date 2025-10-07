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
      triggerHaptic('impactMedium');
      setSpinning(true);
      toast.message("Refreshing bets...");
      
      if (onSync) {
        await onSync();
      } else {
        // Default: Call sync-bets edge function
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user) {
          const { error } = await supabase.functions.invoke('sync-bets', {
            body: { 
              internalId: session.session.user.id, 
              userId: session.session.user.id 
            }
          });
          
          if (error) throw error;
        } else {
          throw new Error("Not authenticated");
        }
      }
      
      toast.success("Bets refreshed");
      triggerRefreshHaptic('success');
    } catch (e) {
      toast.error("Refresh failed");
      triggerRefreshHaptic('error');
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
