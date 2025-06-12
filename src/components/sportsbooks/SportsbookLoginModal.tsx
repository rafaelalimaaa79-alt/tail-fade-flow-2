
import React, { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SportsbookLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  sportsbookId: string | null;
  onSuccess: (sportsbookId: string) => void;
}

const SportsbookLoginModal: React.FC<SportsbookLoginModalProps> = ({
  isOpen,
  onClose,
  sportsbookId,
  onSuccess
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sportsbookNames: { [key: string]: string } = {
    fanduel: "FanDuel",
    hardrock: "Hard Rock Bet"
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call to connect sportsbook
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully connected to ${sportsbookNames[sportsbookId!]}`);
      onSuccess(sportsbookId!);
      
      // Reset form
      setUsername("");
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      toast.error("Failed to connect. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            Connect to {sportsbookId ? sportsbookNames[sportsbookId] : "Sportsbook"}
          </DialogTitle>
          <DialogDescription className="text-center text-white/80">
            Enter your login credentials to sync your betting data securely.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div>
            <Input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 border-white/20 bg-black/50 focus:border-[#AEE3F5] transition-all duration-300"
            />
          </div>
          
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pr-12 border-white/20 bg-black/50 focus:border-[#AEE3F5] transition-all duration-300"
            />
            <button 
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-[#AEE3F5] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit"
              className="w-full h-12 bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium rounded-xl"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Account"}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full h-12 border-white/20 text-white/80 hover:border-[#AEE3F5]/50 hover:bg-[#AEE3F5]/5"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SportsbookLoginModal;
