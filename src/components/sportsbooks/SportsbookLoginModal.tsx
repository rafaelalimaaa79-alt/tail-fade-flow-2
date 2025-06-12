
import React, { useState } from "react";
import { X, Shield, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SportsbookLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  sportsbookId: string | null;
  onSuccess: (sportsbookId: string) => void;
}

const sportsbookNames: Record<string, string> = {
  draftkings: "DraftKings",
  fanduel: "FanDuel",
  betmgm: "BetMGM",
  caesars: "Caesars",
  espnbet: "ESPN BET",
  betrivers: "BetRivers",
};

const SportsbookLoginModal: React.FC<SportsbookLoginModalProps> = ({
  isOpen,
  onClose,
  sportsbookId,
  onSuccess,
}) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const sportsbookName = sportsbookId ? sportsbookNames[sportsbookId] : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      toast.success(`Successfully connected to ${sportsbookName}!`);
      if (sportsbookId) {
        onSuccess(sportsbookId);
      }
      setCredentials({ username: "", password: "" });
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setCredentials({ username: "", password: "" });
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">Connect to {sportsbookName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card/30 border border-white/10 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Your login credentials are encrypted and used only to sync your bet history. We never store passwords or access your account beyond reading confirmed bets.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username or email"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SportsbookLoginModal;
