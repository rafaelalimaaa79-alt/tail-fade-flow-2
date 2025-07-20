import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSaveNotifications = () => {
    // TODO: Implement save functionality
    console.log("Saving notification settings...");
  };

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Notifications</CardTitle>
        <CardDescription className="text-gray-400">
          Control how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Email Notifications</p>
            <p className="text-gray-400 text-sm">Receive updates via email</p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            className="data-[state=checked]:bg-[#AEE3F5]"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Push Notifications</p>
            <p className="text-gray-400 text-sm">Receive push notifications</p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
            className="data-[state=checked]:bg-[#AEE3F5]"
          />
        </div>

        <Button 
          onClick={handleSaveNotifications}
          className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black font-medium"
        >
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;