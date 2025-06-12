import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Shield, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import SportsbookLoginModal from "@/components/sportsbooks/SportsbookLoginModal";

// Initial sportsbooks - FanDuel and Hard Rock with proper logos
const sportsbooks = [
  {
    id: "fanduel",
    name: "FanDuel",
    icon: "/lovable-uploads/6a8039d3-27ef-4e09-814e-f56252fcfba9.png",
    connected: false,
  },
  {
    id: "hardrock",
    name: "Hard Rock Bet",
    icon: "/lovable-uploads/eacb5b66-1588-4e02-8b16-6e3b623501d3.png",
    connected: false,
  },
];

const ConnectSportsbooks = () => {
  const navigate = useNavigate();
  const [connectedSportsbooks, setConnectedSportsbooks] = useState<string[]>([]);
  const [selectedSportsbook, setSelectedSportsbook] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true); // Default to enabled

  const handleConnect = (sportsbookId: string) => {
    setSelectedSportsbook(sportsbookId);
    setShowLoginModal(true);
  };

  const handleConnectionSuccess = (sportsbookId: string) => {
    setConnectedSportsbooks(prev => [...prev, sportsbookId]);
    setShowLoginModal(false);
    setSelectedSportsbook(null);
  };

  const handleContinue = () => {
    // Store Face ID preference before continuing
    localStorage.setItem('biometricEnabled', faceIdEnabled.toString());
    navigate('/onboarding');
  };

  const isConnected = (sportsbookId: string) => connectedSportsbooks.includes(sportsbookId);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/cd6a8903-d55e-4a4c-a745-0b8198dc4270.png" 
            alt="Fade Zone logo" 
            className="h-24 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Link Your Sportsbooks</h1>
          <p className="text-muted-foreground text-sm px-4">
            Security Promise
            Your credentials are encrypted and never stored. We use secure methods to read your confirmed bets — nothing else.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {sportsbooks.map((sportsbook) => (
            <Card key={sportsbook.id} className="p-4 bg-card border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={sportsbook.icon} 
                    alt={`${sportsbook.name} logo`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-white">{sportsbook.name}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {isConnected(sportsbook.id) ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleConnect(sportsbook.id)}
                      className="bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-card/50 border border-white/10 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Fingerprint className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-white mb-1">Enable Face ID for Quick Access</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Log in instantly next time with Face ID. It's secure, private, and faster.
                </p>
                {!faceIdEnabled && (
                  <button 
                    onClick={() => setFaceIdEnabled(true)}
                    className="text-xs text-primary hover:text-primary/80 underline"
                  >
                    I don't want Face ID
                  </button>
                )}
              </div>
            </div>
            <Switch
              checked={faceIdEnabled}
              onCheckedChange={setFaceIdEnabled}
              className="ml-3"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={connectedSportsbooks.length === 0}
          >
            Continue
          </Button>
        </div>
      </div>

      <SportsbookLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        sportsbookId={selectedSportsbook}
        onSuccess={handleConnectionSuccess}
      />
    </div>
  );
};

export default ConnectSportsbooks;
