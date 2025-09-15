import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const SignOutSection = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Account</CardTitle>
        <CardDescription className="text-gray-400">
          Sign out of your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleSignOut}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignOutSection;