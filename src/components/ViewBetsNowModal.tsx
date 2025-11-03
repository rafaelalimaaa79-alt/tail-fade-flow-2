import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ViewBetsNowModalProps {
  isOpen: boolean;
  onRefresh: () => Promise<void>;
  onClose: () => void;
}

/**
 * Modal that appears after 2FA completes
 * Shows "You're in — View Bets Now" button to trigger manual refresh
 */
export const ViewBetsNowModal: React.FC<ViewBetsNowModalProps> = ({
  isOpen,
  onRefresh,
  onClose
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleViewBets = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      onClose();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm p-0 bg-background flex flex-col gap-0 overflow-hidden"
      >
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <DialogTitle className="text-white text-xl font-bold">
                You're In!
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your sportsbook is connected
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Your account is now synced and ready. View your latest bets to get started.
          </p>

          <Button
            onClick={handleViewBets}
            disabled={isRefreshing}
            className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "You're in — View Bets Now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBetsNowModal;

