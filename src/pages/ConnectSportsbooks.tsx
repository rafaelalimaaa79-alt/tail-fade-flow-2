
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SportsbookLoginModal from "@/components/sportsbooks/SportsbookLoginModal";

// Initial sportsbooks - FanDuel and Hard Rock
const sportsbooks = [
  {
    id: "fanduel",
    name: "FanDuel",
    icon: "/lovable-uploads/c77c9dc5-a7dd-4c1c-9428-804d5d7a4a79.png",
    connected: false,
  },
  {
    id: "hardrock",
    name: "Hard Rock Bet",
    icon: "/lovable-uploads/c77c9dc5-a7dd-4c1c-9428-804d5d7a4a79.png",
    connected: false,
  },
];

const ConnectSportsbooks = () => {
  const navigate = useNavigate();
  const [connectedSportsbooks, setConnectedSportsbooks] = useState<string[]>([]);
  const [selectedSportsbook, setSelectedSportsbook] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleConnect = (sportsbookId: string) => {
    setSelectedSportsbook(sportsbookId);
    setShowLoginModal(true);
  };

  const handleConnectionSuccess = (sportsbookId: string) => {
    setConnectedSportsbooks(prev => [...prev, sportsbookId]);
    setShowLoginModal(false);
    setSelectedSportsbook(null);
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleContinue = () => {
    navigate('/');
  };

  const isConnected = (sportsbookId: string) => connectedSportsbooks.includes(sportsbookId);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-24 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Link Your Sportsbooks</h1>
          <p className="text-muted-foreground text-sm px-4">
            Sync your picks automatically by logging in to your sportsbooks. We'll never place bets or share your info. Just pure tracking power.
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
                    className="w-10 h-10 rounded-lg"
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
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-white mb-1">Security Promise</h3>
              <p className="text-sm text-muted-foreground">
                Your credentials are encrypted and never stored. We use secure methods to read your confirmed bets — nothing else.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 bg-primary hover:bg-primary/90"
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
