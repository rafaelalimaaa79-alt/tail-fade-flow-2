
import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const SportsbooksSection = () => {
  const navigate = useNavigate();

  const handleManageSportsbooks = () => {
    navigate('/connect-sportsbooks');
  };

  return (
    <div className="rounded-xl bg-black border border-white/10 p-4 shadow-md">
      <h3 className="mb-3 text-lg font-bold text-white">Connected Sportsbooks</h3>
      
      <div className="space-y-3">
        <div className="text-center py-6">
          <div className="mb-4">
            <Plus className="h-8 w-8 text-muted-foreground mx-auto" />
          </div>
          <p className="text-muted-foreground mb-4">
            Connect your sportsbooks to automatically track your bets
          </p>
          <Button
            onClick={handleManageSportsbooks}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Sportsbooks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SportsbooksSection;
