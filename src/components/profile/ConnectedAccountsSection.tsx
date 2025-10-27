import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Clock, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SharpSportsModal } from "@/components/SharpSportsModal";
import { toast } from "sonner";

// SharpSports BettorAccount structure (raw API response)
interface ConnectedAccount {
  id: string;
  bettor: string;
  book: {
    id: string;
    name: string;
    abbr: string;
  };
  bookRegion: {
    id: string;
    name: string;
    abbr: string;
    status: string;
    country: string;
    sdkRequired: boolean;
    mobileOnly: boolean;
  };
  verified: boolean;
  access: boolean;
  paused: boolean;
  betRefreshRequested: string | null;
  latestRefreshResponse: {
    id: string;
    timeCreated: string;
    status: number;
    detail: string | null;
    requestId: string;
    type: string;
  } | null;
  latestRefreshRequestId: string | null;
  balance: number | null;
  timeCreated: string;
  missingBets: number;
  isUnverifiable: boolean;
  timeUnverified: string | null;
  refreshInProgress: boolean;
  TFA: boolean;
  metadata?: {
    handle?: number;
    unitSize?: number;
    netProfit?: number;
    winPercentage?: number;
    walletShare?: number;
  };
}

interface ConnectedAccountsSectionProps {
  userId: string;
}

const ConnectedAccountsSection: React.FC<ConnectedAccountsSectionProps> = ({ userId }) => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharpSportsModal, setSharpSportsModal] = useState<{
    url: string;
    title: string;
    message: string;
    type: '2fa' | 'relink';
    forcedMode?: boolean;
  } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('get-connected-accounts', {
        body: { internalId: userId }
      });

      if (invokeError) {
        console.error('Error fetching connected accounts:', invokeError);
        setError('Failed to load connected accounts');
        return;
      }

      if (data?.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConnectedAccounts();
    }
  }, [userId]);

  const handleConnectNow = async () => {
    try {
      setIsConnecting(true);
      console.log('Starting SharpSports link flow');

      // Call relink-account edge function to generate context ID
      const { data: linkData, error } = await supabase.functions.invoke('relink-account', {
        body: { internalId: userId }
      });

      if (error || !linkData?.linkUrl) {
        console.error('Failed to generate link URL:', error);
        toast.error('Failed to start linking process');
        setIsConnecting(false);
        return;
      }

      console.log('Link URL generated:', linkData.linkUrl);

      // Open SharpSportsModal with linking flow
      setSharpSportsModal({
        url: linkData.linkUrl,
        title: 'Connect Your Sportsbook',
        message: 'Link your sportsbook account to start tracking bets',
        type: 'relink'
      });

      setIsConnecting(false);
    } catch (error) {
      console.error('Error starting SharpSports link:', error);
      toast.error('Failed to start linking process');
      setIsConnecting(false);
    }
  };

  const handleModalComplete = async () => {
    console.log('SharpSports modal completed');
    setSharpSportsModal(null);

    toast.success('Sportsbook connected successfully!');
    toast.info('Fetching your bets from the sportsbook...');

    // Sync bets after linking with forceRefresh to fetch fresh data
    try {
      const { data, error } = await supabase.functions.invoke('sync-bets', {
        body: {
          internalId: userId,
          userId: userId,
          forceRefresh: true // MUST be true to trigger SharpSports to scrape the newly linked account
        }
      });

      if (error) {
        console.error('Sync error:', error);
        toast.error('Failed to sync bets');
      } else if (data.statusCode && data.statusCode !== 200) {
        console.log('Sync error:', data.message);
        toast.error('Failed to sync bets. Try again.');
      } else {
        console.log('Sync response:', data);
        toast.success('Bets synced successfully!');

        // Refresh the connected accounts list
        await fetchConnectedAccounts();
      }
    } catch (error) {
      console.error('Error syncing bets:', error);
      toast.error('Failed to sync bets');
    }
  };

  const getStatusIcon = (account: ConnectedAccount) => {
    if (account.verified) {
      return <CheckCircle2 className="w-5 h-5 text-onetime-green" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = (account: ConnectedAccount) => {
    if (account.verified) {
      return <span className="text-onetime-green text-sm">Active</span>;
    }
    return <span className="text-yellow-500 text-sm">Needs Attention</span>;
  };

  const formatLastSync = (lastRefreshed: string | null) => {
    if (!lastRefreshed) return "Never synced";
    
    const date = new Date(lastRefreshed);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getBookLogo = (bookName: string) => {
    // Map of sportsbook names to their logo paths (from ConnectSportsbooks.tsx)
    const logoMap: Record<string, string> = {
      'fanduel': '/lovable-uploads/6a8039d3-27ef-4e09-814e-f56252fcfba9.png',
      'hardrock': '/lovable-uploads/eacb5b66-1588-4e02-8b16-6e3b623501d3.png',
      'hardrockbet': '/lovable-uploads/eacb5b66-1588-4e02-8b16-6e3b623501d3.png',
      'draftkings': '/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png',
      'espn': '/lovable-uploads/1b4cf4d6-d079-464c-b7d3-a17230281f25.png',
      'espnbet': '/lovable-uploads/1b4cf4d6-d079-464c-b7d3-a17230281f25.png',
      'caesars': '/lovable-uploads/1c43228f-bd98-4cd2-b560-ec6a33c8534f.png',
      'betmgm': '/lovable-uploads/3e435459-afcf-4bd3-aab8-f85479b54ffa.png',
      'prizepicks': '/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png',
      'fanatics': '/lovable-uploads/7158b6ef-c172-4e78-9294-9cba0c6b6db7.png',
    };

    const bookKey = bookName.toLowerCase().replace(/\s+/g, '');
    return logoMap[bookKey] || null;
  };

  if (loading) {
    return (
      <div className="my-4 rounded-xl bg-black p-6 shadow-md border border-white/10">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading connected accounts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 rounded-xl bg-black p-6 shadow-md border border-white/10">
        <div className="flex items-center justify-center text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <>
        <div className="my-4 rounded-xl bg-black p-6 shadow-md border border-white/10">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-lg font-semibold text-white">Connected Sportsbooks</h3>
          </div>
          <div className="text-center py-6">
            <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 mb-2">No sportsbooks connected</p>
            <p className="text-sm text-gray-500 mb-4">Connect your accounts to start tracking bets</p>

            <Button
              onClick={handleConnectNow}
              disabled={isConnecting}
              className="bg-[#AEE3F5] text-black hover:bg-[#AEE3F5]/90 shadow-[0_0_15px_rgba(174,227,245,0.4)] font-medium"
            >
              {isConnecting ? 'Connecting...' : 'Connect Now'}
            </Button>
          </div>
        </div>

        {sharpSportsModal && (
          <SharpSportsModal
            url={sharpSportsModal.url}
            title={sharpSportsModal.title}
            message={sharpSportsModal.message}
            type={sharpSportsModal.type}
            forcedMode={sharpSportsModal.forcedMode}
            onComplete={handleModalComplete}
            onClose={() => setSharpSportsModal(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="my-4 rounded-xl bg-black p-4 shadow-md border border-white/10">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-white">Connected Sportsbooks</h3>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => {
          const logo = getBookLogo(account.book.name);

          return (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Sportsbook Logo or Icon */}
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <img src={logo} alt={account.book.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-white font-bold text-sm">
                      {account.book.abbr.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{account.book.name}</p>
                    {getStatusIcon(account)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-gray-400">
                      {formatLastSync(account.betRefreshRequested)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="text-right">
                  {getStatusText(account)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} connected
        </p>
      </div>

      {sharpSportsModal && (
        <SharpSportsModal
          url={sharpSportsModal.url}
          title={sharpSportsModal.title}
          message={sharpSportsModal.message}
          type={sharpSportsModal.type}
          forcedMode={sharpSportsModal.forcedMode}
          onComplete={handleModalComplete}
          onClose={() => setSharpSportsModal(null)}
        />
      )}
    </div>
  );
};

export default ConnectedAccountsSection;

