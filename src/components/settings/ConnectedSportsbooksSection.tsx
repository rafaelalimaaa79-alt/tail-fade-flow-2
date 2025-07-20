import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ConnectedSportsbooksSection = () => {
  const navigate = useNavigate();

  const handleConnectSportsbook = () => {
    navigate("/connect-sportsbooks");
  };

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Connected Sportsbooks</CardTitle>
        <CardDescription className="text-gray-400">
          Manage your connected sportsbook accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-6">
          <p className="text-gray-400 mb-6">No sportsbooks connected</p>
          <Button 
            onClick={handleConnectSportsbook}
            className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black font-medium"
          >
            Connect Sportsbook
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedSportsbooksSection;