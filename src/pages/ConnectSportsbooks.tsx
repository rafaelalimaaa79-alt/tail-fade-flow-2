import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  // All sportsbooks start as DISCONNECTED - no localStorage loading on this onboarding page
  const [accounts, setAccounts] = useState<Record<string, SportsbookAccount>>({});
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentTfaBookId, setCurrentTfaBookId] = useState<string | null>(null);
  const [currentCredentialsBookId, setCurrentCredentialsBookId] = useState<string | null>(null);
  const [activeLinkingBook, setActiveLinkingBook] = useState<string | null>(null);
  const [selectedSportsbookId, setSelectedSportsbookId] = useState<string>("");
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [tfaSubmitting, setTfaSubmitting] = useState(false);
  const [tfaError, setTfaError] = useState("");
  const [showWaiting, setShowWaiting] = useState(true);
  const [deferEnabled, setDeferEnabled] = useState(false);
  const [deferred, setDeferred] = useState(false);
  const [showTfaBubble, setShowTfaBubble] = useState(false);


  // Countdown timer effect for 2FA resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show2FAModal && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            setShowWaiting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [show2FAModal, resendCountdown]);

  // Reset 2FA modal state when opened
  useEffect(() => {
    if (show2FAModal) {
      setTfaCode('');
      setTfaError('');
      setTfaSubmitting(false);
      setResendCountdown(30);
      setCanResend(false);
      setShowWaiting(true);
      setDeferEnabled(false);
    }
  }, [show2FAModal]);

  // Enable "later" option immediately
  useEffect(() => {
    if (show2FAModal) {
      setDeferEnabled(true);
    }
  }, [show2FAModal]);

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
    console.log(`handleAction called with sportsbook: ${sportsbook.name}, action: ${action}`);
    
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
      console.log(`About to show credentials modal for ${sportsbook.name}`);
      setCurrentCredentialsBookId(sportsbook.id);
      setShowCredentialsModal(true);
    }
  };

  const submitCredentials = async () => {
    if (!username.trim() || !password.trim() || !currentCredentialsBookId) return;
    
    const sportsbook = sportsbooks.find(sb => sb.id === currentCredentialsBookId);
    if (!sportsbook) return;
    
    console.log(`Credentials submitted for ${sportsbook.name}: ${username}/${password}`);
    
    // Hide credentials modal and start linking process
    setShowCredentialsModal(false);
    setUsername('');
    setPassword('');
    
    // Now proceed with the actual linking
    await startWebLink(sportsbook);
  };

  const startWebLink = async (sportsbook: any) => {
    console.log(`Starting link process for ${sportsbook.name}`);
    setStatus(sportsbook.id, 'LINKING');
    setActiveLinkingBook(sportsbook.id);
    
    try {
      // Simulate opening SharpSports popup and user entering credentials
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Force 2FA for Hard Rock Bet to demo the flow
      if (sportsbook.id === 'hardrock') {
        console.log(`Forcing 2FA for ${sportsbook.name}`);
        setStatus(sportsbook.id, 'NEEDS_2FA');
        setCurrentTfaBookId(sportsbook.id);
        setShow2FAModal(true);
        toast.info(`${sportsbook.name} requires 2FA verification to complete linking.`);
        setActiveLinkingBook(null);
        return;
      }
      
      // Simulate realistic outcomes for other sportsbooks
      const outcomes = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'NEEDS_2FA', 'ERROR'];
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      console.log(`Link outcome for ${sportsbook.name}: ${outcome}`);
      
      if (outcome === 'SUCCESS') {
        setStatus(sportsbook.id, 'LINKED');
        toast.success(`${sportsbook.name} connected successfully!`);
        setActiveLinkingBook(null);
      } else if (outcome === 'NEEDS_2FA') {
        // Only set NEEDS_2FA during active linking when provider specifically requests it
        if (activeLinkingBook === sportsbook.id) {
          setStatus(sportsbook.id, 'NEEDS_2FA');
          setCurrentTfaBookId(sportsbook.id);
          setShow2FAModal(true);
          toast.info(`${sportsbook.name} requires 2FA verification to complete linking.`);
        }
      } else {
        setStatus(sportsbook.id, 'ERROR');
        toast.error('Connection failed. Please try again.');
        setActiveLinkingBook(null);
      }
    } catch (e) {
      console.error(`Link error for ${sportsbook.name}:`, e);
      setStatus(sportsbook.id, 'ERROR');
      toast.error('Connection failed. Please try again.');
      setActiveLinkingBook(null);
    }
  };

  // Handle 2FA code input with auto-submit and digit-only filtering
  const handleTfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8); // Only digits, max 8
    setTfaCode(value);
    setTfaError('');
    
    // Auto-submit at 6 digits
    if (value.length === 6 && !tfaSubmitting) {
      submit2FA(value);
    }
  };

  const submit2FA = async (code?: string) => {
    const codeToSubmit = code || tfaCode.trim();
    if (!codeToSubmit || codeToSubmit.length < 6 || !currentTfaBookId || tfaSubmitting) return;
    
    setTfaSubmitting(true);
    setTfaError('');
    
    try {
      // Simulate 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (codeToSubmit === '12345' || codeToSubmit === '123456' || Math.random() > 0.5) {
        setStatus(currentTfaBookId, 'LINKED');
        toast.success('Successfully verified and connected!');
        setShow2FAModal(false);
        setTfaCode('');
        setCurrentTfaBookId(null);
        setActiveLinkingBook(null);
      } else {
        setTfaError('Invalid code. Double‑check and try again.');
      }
    } catch (e) {
      setTfaError('Network issue. Try again.');
    } finally {
      setTfaSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendCountdown(15); // Shorter countdown on resend
    setCanResend(false);
    setShowWaiting(true);
    toast.info('Verification code resent!');
  };

  
  // Debug function to reset stuck state
  const resetSportsbookState = (sportsbookId: string) => {
    console.log(`Resetting state for ${sportsbookId}`);
    setAccounts(prev => {
      const updated = { ...prev };
      delete updated[sportsbookId];
      return updated;
    });
    setActiveLinkingBook(null);
  };

  const doLater = () => {
    if (!deferEnabled) return;
    setDeferred(true);
    setShow2FAModal(false);
    setShowTfaBubble(true);
    // Store TFA state for onboarding
    const sportsbook = sportsbooks.find(sb => sb.id === activeLinkingBook);
    localStorage.setItem('pendingTFA', JSON.stringify({ 
      accountIdTemp: activeLinkingBook,
      sportsbookName: sportsbook?.name || ''
    }));
  };

  const handleContinue = () => {
    localStorage.setItem('biometricEnabled', faceIdEnabled.toString());
    navigate('/onboarding');
  };

  const anyLinked = Object.values(accounts).some(account => account.status === 'LINKED');
  const canProceed = (anyLinked || deferred) && faceIdEnabled;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Link Your Sportsbooks</h1>
          <p className="text-muted-foreground text-sm px-4">
            Security Promise: Your credentials are encrypted and never stored. We use secure methods to read your confirmed bets — nothing else.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Sportsbook Selection Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Select a Sportsbook</label>
            <Select value={selectedSportsbookId} onValueChange={setSelectedSportsbookId}>
              <SelectTrigger className="w-full bg-card border-white/20 text-white">
                <SelectValue placeholder="Choose a sportsbook to connect..." />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 z-50">
                {sportsbooks.map((sportsbook) => (
                  <SelectItem 
                    key={sportsbook.id} 
                    value={sportsbook.id}
                    className="text-white hover:bg-card focus:bg-card cursor-pointer"
                  >
                    {sportsbook.name}
                  </SelectItem>
                ))}
                <SelectItem 
                  value="no-sportsbook"
                  className="text-white hover:bg-card focus:bg-card cursor-pointer"
                >
                  No Sportsbook
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Sportsbook Card */}
          {selectedSportsbookId && (() => {
            // Handle "No Sportsbook" selection
            if (selectedSportsbookId === "no-sportsbook") {
              return (
                <Card className="p-6 bg-card border border-white/10">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-xl font-semibold text-white">
                      No Sportsbook
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      You can continue without connecting a sportsbook for now
                    </div>
                    
                    <div className="w-full">
                      <button
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-600/50 text-gray-400 cursor-default"
                      >
                        No Connection Needed
                      </button>
                    </div>
                  </div>
                </Card>
              );
            }

            const selectedSportsbook = sportsbooks.find(sb => sb.id === selectedSportsbookId);
            if (!selectedSportsbook) return null;
            
            const status = getStatus(selectedSportsbook.id);
            const statusLabel = getStatusLabel(status, selectedSportsbook.requiresSdk);
            const isLinked = status === 'LINKED';
            
            return (
              <Card className="p-6 bg-card border border-white/10">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-xl font-semibold text-white">
                    {selectedSportsbook.name}
                  </div>
                  
                  <div className={`text-sm ${isLinked ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {statusLabel}
                  </div>
                  
                  <div className="w-full">
                    {isLinked ? (
                      <button
                        onClick={() => handleAction(selectedSportsbook, 'fixSync')}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-600/50 text-gray-400 cursor-default"
                      >
                        Connected
                      </button>
                    ) : status === 'NEEDS_2FA' ? (
                      <button
                        onClick={() => handleAction(selectedSportsbook, 'enter2fa')}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-[#AEE3F5] text-black hover:bg-[#AEE3F5]/90 shadow-[0_0_15px_rgba(174,227,245,0.4)]"
                      >
                        Enter Code
                      </button>
                    ) : status === 'LINKING' ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      >
                        Linking…
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(selectedSportsbook, 'connect')}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-[#AEE3F5] text-black hover:bg-[#AEE3F5]/90 shadow-[0_0_15px_rgba(174,227,245,0.4)]"
                      >
                        Connect Now
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })()}
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
          <DialogHeader className="flex-row justify-between items-center">
            <DialogTitle className="text-white">Enter Verification Code</DialogTitle>
            <button 
              onClick={() => setShow2FAModal(false)}
              className="text-white/70 hover:text-white text-xl"
            >
              ✕
            </button>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {(() => {
                const sportsbook = sportsbooks.find(sb => sb.id === currentTfaBookId);
                return `${sportsbook?.name || 'Your sportsbook'} is sending you a verification code.`;
              })()}
            </p>
            
            {showWaiting && (
              <div className="text-muted-foreground text-sm flex items-center gap-2">
                <div className="w-2.5 h-2.5 border-2 border-[#AEE3F5] border-r-transparent rounded-full animate-spin"></div>
                Waiting for the code…
              </div>
            )}

            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={tfaCode}
              onChange={handleTfaCodeChange}
              maxLength={8}
              className="bg-black border-white/20 text-white text-center text-lg tracking-widest"
              autoFocus
            />

            <div className="text-muted-foreground text-sm">
              Didn't get it? {!canResend ? (
                <span>Resend available in <strong>{resendCountdown}s</strong></span>
              ) : (
                <button 
                  onClick={handleResend}
                  className="text-[#AEE3F5] hover:underline"
                >
                  Resend now
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => submit2FA()}
                className="flex-1"
                disabled={tfaCode.length < 6 || tfaSubmitting}
              >
                {tfaSubmitting ? 'Submitting…' : 'Submit'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={doLater}
                className="flex-1"
              >
                Proceed now — you can enter the code here anytime once you receive it
              </Button>
            </div>

            {tfaError && (
              <div className="text-red-400 text-sm mt-2">
                {tfaError}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCredentialsModal} onOpenChange={setShowCredentialsModal}>
        <DialogContent className="sm:max-w-md bg-black border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Enter Sportsbook Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Enter your sportsbook username and password to connect.
            </p>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black border-white/20 text-white"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && submitCredentials()}
            />
            <div className="flex gap-3">
              <Button 
                onClick={submitCredentials} 
                className="flex-1"
                disabled={!username.trim() || !password.trim()}
              >
                Connect
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowCredentialsModal(false);
                  setUsername('');
                  setPassword('');
                  setCurrentCredentialsBookId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
          </Dialog>

          {/* Floating TFA Bubble */}
          {showTfaBubble && (
            <button
              onClick={() => {
                setShow2FAModal(true);
                setShowTfaBubble(false);
              }}
              className="fixed right-4 bottom-4 z-50 bg-[#6b66ff] hover:bg-[#6b66ff]/90 text-white border border-[#6b66ff] rounded-full px-4 py-3 shadow-lg font-semibold transition-all duration-300"
              aria-label="Enter verification code"
            >
              Enter Code
            </button>
          )}
        </div>
      );
    };

    export default ConnectSportsbooks;