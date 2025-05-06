
import React, { useState, useEffect } from "react";
import { Bell, ArrowDown, Award, Trophy, Flame, Snowflake } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ActionButton from "@/components/ActionButton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

// Mock data for hottest and coldest bettors
const hottestBettors = Array.from({ length: 100 }, (_, i) => ({
  id: `hot-${i + 1}`,
  name: `HotBettor${i + 1}`,
  profit: Math.round((5000 - i * 45) * 100) / 100,
  winRate: Math.round(75 - i * 0.3),
  streak: Math.min(15, 10 - Math.floor(i / 10)),
}));

const coldestBettors = Array.from({ length: 100 }, (_, i) => ({
  id: `cold-${i + 1}`,
  name: `ColdBettor${i + 1}`,
  profit: Math.round((-4500 + i * 40) * 100) / 100,
  winRate: Math.round(30 + i * 0.25),
  streak: -Math.min(12, 8 - Math.floor(i / 12)),
}));

const Leaders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "cold" ? "cold" : "hot";
  const [activeTab, setActiveTab] = useState<"hot" | "cold">(initialType);
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ type: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "hot" | "cold");
    setShowAll(false);
  };

  const currentLeaders = activeTab === "hot" ? hottestBettors : coldestBettors;
  const displayLeaders = showAll ? currentLeaders : currentLeaders.slice(0, 10);

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
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers on the platform</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="hot" className="relative">
              <span className="text-onetime-green text-lg font-bold">
                Hottest Bettors <Flame className="inline-block ml-1 h-5 w-5" />
              </span>
            </TabsTrigger>
            <TabsTrigger value="cold" className="relative">
              <span className="text-onetime-red text-lg font-bold">
                Coldest Bettors <Snowflake className="inline-block ml-1 h-5 w-5" />
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hot" className="space-y-4">
            <div className="rounded-xl bg-card border border-white/10 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Bettor</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Win %</TableHead>
                    <TableHead>Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLeaders.map((bettor, index) => (
                    <TableRow 
                      key={bettor.id} 
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => navigate(`/bettor/${bettor.id}`)}
                    >
                      <TableCell className="font-medium">
                        {index < 3 && (
                          <Award className="inline-block mr-1 text-yellow-500" size={16} />
                        )}
                        {index + 1}
                      </TableCell>
                      <TableCell>@{bettor.name}</TableCell>
                      <TableCell className="text-onetime-green">
                        +${bettor.profit.toLocaleString()}
                      </TableCell>
                      <TableCell>{bettor.winRate}%</TableCell>
                      <TableCell className="text-onetime-green">
                        W{bettor.streak}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {!showAll && (
                <div className="mt-4">
                  <ActionButton 
                    variant="tail" 
                    onClick={() => setShowAll(true)}
                  >
                    View All 100 Hottest Bettors
                  </ActionButton>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="cold" className="space-y-4">
            <div className="rounded-xl bg-card border border-white/10 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Bettor</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Win %</TableHead>
                    <TableHead>Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLeaders.map((bettor, index) => (
                    <TableRow 
                      key={bettor.id} 
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => navigate(`/bettor/${bettor.id}`)}
                    >
                      <TableCell className="font-medium">
                        {index < 3 && (
                          <Award className="inline-block mr-1 text-yellow-500" size={16} />
                        )}
                        {index + 1}
                      </TableCell>
                      <TableCell>@{bettor.name}</TableCell>
                      <TableCell className="text-onetime-red">
                        ${bettor.profit.toLocaleString()}
                      </TableCell>
                      <TableCell>{bettor.winRate}%</TableCell>
                      <TableCell className="text-onetime-red">
                        L{Math.abs(bettor.streak)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {!showAll && (
                <div className="mt-4">
                  <ActionButton 
                    variant="fade" 
                    onClick={() => setShowAll(true)}
                  >
                    View All 100 Coldest Bettors
                  </ActionButton>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default Leaders;
