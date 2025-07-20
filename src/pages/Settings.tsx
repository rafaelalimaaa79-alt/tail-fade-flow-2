
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import AccountSettingsSection from "@/components/settings/AccountSettingsSection";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import ConnectedSportsbooksSection from "@/components/settings/ConnectedSportsbooksSection";
import PrivacySection from "@/components/settings/PrivacySection";

const Settings = () => {
  const navigate = useNavigate();

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
          <AccountSettingsSection />
          <SubscriptionSection />
          <NotificationsSection />
          <ConnectedSportsbooksSection />
          <PrivacySection />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
