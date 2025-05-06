
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, Calendar, DollarSign, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Compete = () => {
  const [activeTab, setActiveTab] = useState("tournaments");
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-20"
            />
          </div>
          <button className="rounded-full p-2 text-white/80 hover:text-white">
            <Bell className="h-6 w-6" />
          </button>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Compete</h1>
          <p className="text-sm text-muted-foreground mt-1">Challenge others and win big</p>
        </div>

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

          {/* Tournaments Tab Content */}
          <TabsContent value="tournaments" className="space-y-4">
            <Card className="p-4 overflow-hidden relative border border-white/10 bg-card hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                LIVE
              </div>
              <h3 className="text-lg font-bold">3-Day Heater</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>$10 Entry</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4 text-yellow-500" />
                  <span>2 days left</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>36/50 Spots</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>Ends Apr 9</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                Join Tournament
              </Button>
            </Card>

            <Card className="p-4 overflow-hidden relative border border-white/10 bg-card hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-500">
                STARTING SOON
              </div>
              <h3 className="text-lg font-bold">Weekend Warrior</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>$25 Entry</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4 text-yellow-500" />
                  <span>Starts in 3h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>18/50 Spots</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>3-day event</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                Join Tournament
              </Button>
            </Card>

            <div className="flex justify-center my-6">
              <Button variant="outline" className="text-muted-foreground">
                View Past Tournaments
              </Button>
            </div>
          </TabsContent>

          {/* Fixed Matches Tab Content */}
          <TabsContent value="fixed" className="space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-center">1v1 Matches</h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {[
                { buyIn: 5, days: 1 },
                { buyIn: 10, days: 2 },
                { buyIn: 25, days: 3 }
              ].map((match, index) => (
                <Card key={index} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
                  <h3 className="text-lg font-bold">1v1 Challenge</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${match.buyIn} Buy-in</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>{match.days} Day{match.days > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Win ${(match.buyIn * 1.9).toFixed(2)} by beating your random opponent
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                    Join Now
                  </Button>
                </Card>
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-2 text-center">2v2 Duos</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { buyIn: 5, days: 2 },
                { buyIn: 10, days: 3 }
              ].map((match, index) => (
                <Card key={index} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
                  <h3 className="text-lg font-bold">2v2 Duos</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${match.buyIn} Buy-in</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>{match.days} Days</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Team up with a random partner to win ${(match.buyIn * 3.8).toFixed(2)}
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                    Join Now
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Custom Matches Tab Content */}
          <TabsContent value="custom" className="space-y-4">
            <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 mb-6">
              Create Custom Match
            </Button>

            <h2 className="text-lg font-semibold mb-2 text-center">Open Custom Matches</h2>
            <div className="space-y-4">
              <Card className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">1v1 Challenge</h3>
                  <div className="bg-blue-500/20 px-2 py-1 rounded text-xs font-semibold text-blue-500">
                    PUBLIC
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>$50 Buy-in</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>2 Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Created by u/ProPicker</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Join Match
                </Button>
              </Card>

              <Card className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">2v2 Duos</h3>
                  <div className="bg-blue-500/20 px-2 py-1 rounded text-xs font-semibold text-blue-500">
                    PUBLIC
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>$20 Buy-in</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>3 Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>2/4 Users Joined</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Join Match
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default Compete;
