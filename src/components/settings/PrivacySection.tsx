import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacySection = () => {
  const [publicProfile, setPublicProfile] = useState(true);

  const handleSavePrivacy = () => {
    // TODO: Implement save functionality
    console.log("Saving privacy settings...");
  };

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Privacy</CardTitle>
        <CardDescription className="text-gray-400">
          Control your privacy and data settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Public Profile</p>
            <p className="text-gray-400 text-sm">Make your stats visible to others</p>
          </div>
          <Switch
            checked={publicProfile}
            onCheckedChange={setPublicProfile}
            className="data-[state=checked]:bg-[#AEE3F5]"
          />
        </div>

        <Separator className="bg-gray-700" />

        <div className="space-y-3">
          <Button 
            onClick={handleSavePrivacy}
            className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black font-medium"
          >
            Save Privacy Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-400 font-medium"
          >
            Delete My Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySection;