import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SubscriptionSection = () => {
  return (
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
  );
};

export default SubscriptionSection;