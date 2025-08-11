import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const sportsbooks = [
  {
    id: "fanduel",
    name: "FanDuel",
    icon: "/lovable-uploads/6a8039d3-27ef-4e09-814e-f56252fcfba9.png",
    requiresSdk: true,
    logoText: "FD",
  },
  {
    id: "hardrock",
    name: "Hard Rock Bet",
    icon: "/lovable-uploads/eacb5b66-1588-4e02-8b16-6e3b623501d3.png",
    requiresSdk: false,
    logoText: "HR",
  },
  {
    id: "draftkings",
    name: "DraftKings",
    icon: "/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png",
    requiresSdk: true,
    logoText: "DK",
  },
  {
    id: "espn",
    name: "ESPN BET",
    icon: "/lovable-uploads/1b4cf4d6-d079-464c-b7d3-a17230281f25.png",
    requiresSdk: false,
    logoText: "EB",
  },
  {
    id: "caesars",
    name: "Caesars",
    icon: "/lovable-uploads/1c43228f-bd98-4cd2-b560-ec6a33c8534f.png",
    requiresSdk: false,
    logoText: "CZ",
  },
  {
    id: "betmgm",
    name: "BetMGM",
    icon: "/lovable-uploads/3e435459-afcf-4bd3-aab8-f85479b54ffa.png",
    requiresSdk: true,
    logoText: "BM",
  },
  {
    id: "prizepicks",
    name: "PrizePicks",
    icon: "/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png",
    requiresSdk: true,
    logoText: "PP",
  },
  {
    id: "fanatics",
    name: "Fanatics",
    icon: "/lovable-uploads/7158b6ef-c172-4e78-9294-9cba0c6b6db7.png",
    requiresSdk: true,
    logoText: "FN",
  },
];

type SportsbookStatus = 'DISCONNECTED' | 'LINKING' | 'NEEDS_2FA' | 'LINKED' | 'ERROR';

interface SportsbookAccount {
  status: SportsbookStatus;
  accountIdTemp?: string;
}

const ConnectSportsbooks = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Record<string, SportsbookAccount>>({});
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [currentTfaBookId, setCurrentTfaBookId] = useState<string | null>(null);

  useEffect(() => {
    const initAccounts = async () => {
      try {
        const saved = localStorage.getItem('sportsbookAccounts');
        if (saved) {
          setAccounts(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load accounts:', e);
      }
    };
    initAccounts();
  }, []);

  const getStatus = (sportsbookId: string): SportsbookStatus => {
    return accounts[sportsbookId]?.status || 'DISCONNECTED';
  };

  const setStatus = (sportsbookId: string, status: SportsbookStatus, accountIdTemp?: string) => {
    setAccounts(prev => {
      const updated = {
        ...prev,
        [sportsbookId]: { 
          status, 
          accountIdTemp: accountIdTemp || prev[sportsbookId]?.accountIdTemp 
        }
      };
      localStorage.setItem('sportsbookAccounts', JSON.stringify(updated));
      return updated;
    });
  };

  const getStatusLabel = (status: SportsbookStatus, requiresSdk: boolean): string => {
    if (requiresSdk) return 'Link via mobile app (coming soon)';
    if (status === 'LINKING') return 'Linking…';
    if (status === 'NEEDS_2FA') return 'Verification code required';
    if (status === 'LINKED') return 'Connected ✓';
    if (status === 'ERROR') return 'Error — try again';
    return 'Not connected';
  };

  const handleAction = async (sportsbook: any, action: string) => {
    if (action === 'mobileInfo') {
      toast.info('This sportsbook must be linked on the iOS/Android app.');
      return;
    }
    
    if (action === 'enter2fa') {
      setCurrentTfaBookId(sportsbook.id);
      setShow2FAModal(true);
      return;
    }
    
    if (action === 'fixSync' || action === 'connect') {
      await startWebLink(sportsbook);
    }
  };

  const startWebLink = async (sportsbook: any) => {
    setStatus(sportsbook.id, 'LINKING');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate different outcomes
      const outcomes = ['SUCCESS', 'NEEDS_2FA', 'ERROR'];
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      if (outcome === 'SUCCESS') {
        setStatus(sportsbook.id, 'LINKED');
        toast.success(`${sportsbook.name} connected successfully!`);
      } else if (outcome === 'NEEDS_2FA') {
        setStatus(sportsbook.id, 'NEEDS_2FA');
        setCurrentTfaBookId(sportsbook.id);
        setShow2FAModal(true);
      } else {
        setStatus(sportsbook.id, 'ERROR');
        toast.error('Connection failed. Please try again.');
      }
    } catch (e) {
      setStatus(sportsbook.id, 'ERROR');
      toast.error('Connection failed. Please try again.');
    }
  };

  const submit2FA = async () => {
    if (!tfaCode.trim() || !currentTfaBookId) return;
    
    try {
      // Simulate 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (tfaCode === '123456' || Math.random() > 0.5) {
        setStatus(currentTfaBookId, 'LINKED');
        toast.success('Successfully verified and connected!');
        setShow2FAModal(false);
        setTfaCode('');
        setCurrentTfaBookId(null);
      } else {
        toast.error('Invalid code. Please try again.');
      }
    } catch (e) {
      toast.error('Could not submit code. Try again.');
    }
  };

  const handleContinue = () => {
    localStorage.setItem('biometricEnabled', faceIdEnabled.toString());
    navigate('/onboarding');
  };

  const anyLinked = Object.values(accounts).some(account => account.status === 'LINKED');
  const canProceed = anyLinked && faceIdEnabled;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Link Your Sportsbooks</h1>
          <p className="text-muted-foreground text-sm px-4">
            Security Promise: Your credentials are encrypted and never stored. We use secure methods to read your confirmed bets — nothing else.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {sportsbooks.map((sportsbook) => {
            const status = getStatus(sportsbook.id);
            const statusLabel = getStatusLabel(status, sportsbook.requiresSdk);
            const isLinked = status === 'LINKED';
            
            return (
              <Card key={sportsbook.id} className="p-4 bg-card border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black border border-white/20 flex items-center justify-center overflow-hidden">
                      {sportsbook.icon ? (
                        <img 
                          src={sportsbook.icon} 
                          alt={`${sportsbook.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-medium text-white">{sportsbook.logoText}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{sportsbook.name}</span>
                        {sportsbook.requiresSdk && (
                          <Badge variant="secondary" className="text-xs">SDK Required</Badge>
                        )}
                      </div>
                      <div className={`text-sm ${isLinked ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {statusLabel}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isLinked ? (
                      <Button
                        onClick={() => handleAction(sportsbook, 'fixSync')}
                        variant="outline"
                        size="sm"
                      >
                        Fix Sync
                      </Button>
                    ) : status === 'NEEDS_2FA' ? (
                      <Button
                        onClick={() => handleAction(sportsbook, 'enter2fa')}
                        className="bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        Enter Code
                      </Button>
                    ) : status === 'LINKING' ? (
                      <Button disabled size="sm">
                        Linking…
                      </Button>
                    ) : sportsbook.requiresSdk ? (
                      <Button
                        onClick={() => handleAction(sportsbook, 'mobileInfo')}
                        variant="outline"
                        size="sm"
                      >
                        Learn More
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAction(sportsbook, 'connect')}
                        className="bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="bg-card/50 border border-white/10 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Fingerprint className="h-5 w-5 text-[#AEE3F5] mt-0.5" />
            <div>
              <h3 className="font-medium text-white mb-1">Enable Face ID for Quick Access</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Log in instantly next time with Face ID. It's secure, private, and faster.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setFaceIdEnabled(!faceIdEnabled)}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              !faceIdEnabled 
                ? 'bg-[#AEE3F5] text-black hover:bg-[#AEE3F5]/90 shadow-[0_0_15px_rgba(174,227,245,0.4)]' 
                : 'bg-gray-600/50 text-gray-400 cursor-default'
            }`}
          >
            {!faceIdEnabled ? 'Enable Face ID' : 'Face ID Enabled'}
          </button>
        </div>

        {!canProceed && (
          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              Please connect at least one sportsbook and enable Face ID to continue.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!canProceed}
            className={`w-full transition-all duration-500 ${
              canProceed && faceIdEnabled 
                ? 'bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black shadow-[0_0_30px_rgba(174,227,245,0.9)] animate-pulse brightness-150' 
                : canProceed
                ? 'bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            Continue
          </Button>
        </div>
      </div>

      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="sm:max-w-md bg-black border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Enter Verification Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Paste the code your sportsbook just sent.
            </p>
            <Input
              placeholder="123456"
              value={tfaCode}
              onChange={(e) => setTfaCode(e.target.value)}
              maxLength={8}
              className="bg-black border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && submit2FA()}
            />
            <div className="flex gap-3">
              <Button onClick={submit2FA} className="flex-1">
                Submit
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShow2FAModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectSportsbooks;