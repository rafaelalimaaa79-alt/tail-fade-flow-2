import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

interface ForceRefreshModalProps {
  isOpen: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * Non-dismissable modal that appears 90 seconds after landing on the dashboard
 * Forces user to refresh their bets to ensure fresh data
 */
export const ForceRefreshModal: React.FC<ForceRefreshModalProps> = ({
  isOpen,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Non-dismissable - prevent closing by clicking outside or pressing Escape
      return false;
    }}>
      <DialogContent
        className="max-w-sm p-0 bg-background flex flex-col gap-0 overflow-hidden"
        hideCloseButton={true}
      >
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-white text-xl font-bold">
            Let's Sync Your Bets
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            We want to make sure you have the latest bet data
          </p>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-[#AEE3F5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                Fresh Data
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Get the latest bets from your sportsbook
              </p>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Bets Now
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            This ensures your bets are up to date
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForceRefreshModal;

