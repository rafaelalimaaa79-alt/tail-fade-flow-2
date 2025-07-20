import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AccountSettingsSection = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveAccountSettings = () => {
    // TODO: Implement save functionality
    console.log("Saving account settings...");
  };

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Account Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Manage your account information and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-900 border-gray-600 text-white focus:border-[#AEE3F5] focus:ring-[#AEE3F5]"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="current-password" className="text-white font-medium">Current Password</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white pr-12 focus:border-[#AEE3F5] focus:ring-[#AEE3F5]"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-[#AEE3F5]"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="new-password" className="text-white font-medium">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white pr-12 focus:border-[#AEE3F5] focus:ring-[#AEE3F5]"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-[#AEE3F5]"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSaveAccountSettings}
          className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black font-medium"
        >
          Save Account Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsSection;