
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import ConnectedAccountsSection from "@/components/profile/ConnectedAccountsSection";
import SignOutSection from "@/components/settings/SignOutSection";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
          {user?.id && <ConnectedAccountsSection userId={user.id} />}
          <SubscriptionSection />
          <SignOutSection />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
