
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  // Form states
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveAccountSettings = () => {
    // TODO: Implement save functionality
    console.log("Saving account settings...");
  };

  const handleSaveNotifications = () => {
    // TODO: Implement save functionality
    console.log("Saving notification settings...");
  };

  const handleSavePrivacy = () => {
    // TODO: Implement save functionality
    console.log("Saving privacy settings...");
  };

  const handleConnectSportsbook = () => {
    navigate("/connect-sportsbooks");
  };

  return (
    <div className="bg-black min-h-screen pb-20">
      <div className="max-w-md mx-auto w-full px-4">
        {/* Header */}
        <div className="flex items-center pt-6 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="text-[#AEE3F5] hover:bg-[#AEE3F5]/10 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold text-white font-rajdhani tracking-wider">
            Settings
          </h1>
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
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

          {/* Subscription */}
          <Card className="bg-black border border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-xl font-rajdhani">Subscription</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">Current Plan</p>
                  <p className="text-gray-400 text-sm">Free Tier</p>
                </div>
                <Button className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black font-medium">
                  Upgrade
                </Button>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 hover:border-[#AEE3F5]">
                  Update Payment Method
                </Button>
                <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-400">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
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

          {/* Connected Sportsbooks */}
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

          {/* Privacy */}
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
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
