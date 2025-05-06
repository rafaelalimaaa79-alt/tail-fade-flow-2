
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/compete/PageHeader";
import TournamentList from "@/components/compete/TournamentList";
import FixedMatchesList from "@/components/compete/FixedMatchesList";
import CustomMatchesList from "@/components/compete/CustomMatchesList";

const Compete = () => {
  const [activeTab, setActiveTab] = useState("tournaments");
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <PageHeader />

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
      </div>
      <BottomNav />
    </div>
  );
};

export default Compete;
