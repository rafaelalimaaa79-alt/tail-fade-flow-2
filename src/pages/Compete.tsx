
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/compete/PageHeader";
import TournamentList from "@/components/compete/TournamentList";
import FixedMatchesList from "@/components/compete/FixedMatchesList";
import CustomMatchesList from "@/components/compete/custom-matches/CustomMatchesList";
import ProfileIcon from "@/components/common/ProfileIcon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const AuthCard: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    // Redirect to auth page (you'll need to create this)
    // For now, let's just show a toast
    toast.info("Authentication is required. This will be implemented in a future update.");
  };

  return (
    <Card className="p-6 max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold text-center mb-4">Sign In Required</h2>
      <p className="text-center mb-6">
        You need to be signed in to view and join challenges.
      </p>
      <Button 
        className="w-full" 
        onClick={handleSignIn}
      >
        Sign In
      </Button>
    </Card>
  );
};

const Compete = () => {
  const [activeTab, setActiveTab] = useState("tournaments");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(true); // Set to true by default now
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };
    
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleBypassAuth = () => {
    setBypassAuth(true);
    toast.success("Testing mode enabled. You can now access all features.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-end pt-4 mb-4">
          <ProfileIcon />
        </div>
        
        <PageHeader />

        {!user && !bypassAuth ? (
          <>
            <AuthCard />
            <div className="mt-4 mx-auto max-w-md">
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle>Developer Mode</AlertTitle>
                <AlertDescription>
                  Want to test the 1v1 flow without signing in?
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-500 ml-2"
                    onClick={handleBypassAuth}
                  >
                    Bypass Authentication
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </>
        ) : (
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 bg-gray-100 mb-6">
              <TabsTrigger 
                value="tournaments" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Tournaments
              </TabsTrigger>
              <TabsTrigger 
                value="fixed" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Fixed Matches
              </TabsTrigger>
              <TabsTrigger 
                value="custom" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Custom Matches
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tournaments">
              <TournamentList />
            </TabsContent>

            <TabsContent value="fixed">
              <FixedMatchesList />
            </TabsContent>

            <TabsContent value="custom">
              <CustomMatchesList />
            </TabsContent>
          </Tabs>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Compete;
