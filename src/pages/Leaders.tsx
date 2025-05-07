
import React, { useState, useEffect } from "react";
import { Briefcase, Award } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ActionButton from "@/components/ActionButton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for hottest bettors with rounded numbers - reduced to 50
const hottestBettors = Array.from({ length: 50 }, (_, i) => ({
  id: `hot-${i + 1}`,
  name: `HotBettor${i + 1}`,
  profit: Math.round(50 - i * 0.08),
  winRate: Math.round(75 - i * 0.06),
  streak: Math.min(15, 10 - Math.floor(i / 5)),
}));

const coldestBettors = Array.from({ length: 50 }, (_, i) => ({
  id: `cold-${i + 1}`,
  name: `ColdBettor${i + 1}`,
  profit: Math.round(-(45 - i * 0.08)),
  winRate: Math.round(30 + i * 0.5),
  streak: -Math.min(12, 8 - Math.floor(i / 6)),
}));

const Leaders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "fade" ? "cold" : "hot";
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
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-16"
            />
          </div>
          <button 
            className="rounded-full p-2 text-white/80 hover:text-white"
            onClick={() => navigate('/portfolio')}
          >
            <Briefcase className="h-5 w-5" />
          </button>
        </header>

        <div className="mb-4">
          <h1 className="text-xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top performers on the platform</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="hot" className="relative">
              <span className="text-onetime-green text-base font-bold">
                Tail Leaders
              </span>
            </TabsTrigger>
            <TabsTrigger value="cold" className="relative">
              <span className="text-onetime-red text-base font-bold">
                Fade Leaders
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hot" className="space-y-2">
            <div className="rounded-xl bg-card border border-white/10 p-2">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Rank</TableHead>
                      <TableHead>Bettor</TableHead>
                      <TableHead className="w-[80px]">Units up</TableHead>
                      <TableHead className="w-[60px]">Win %</TableHead>
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
                            <Award className="inline-block mr-1 text-yellow-500" size={14} />
                          )}
                          {index + 1}
                        </TableCell>
                        <TableCell>@{bettor.name}</TableCell>
                        <TableCell className="text-onetime-green">
                          +{bettor.profit}u
                        </TableCell>
                        <TableCell>{bettor.winRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              {!showAll && (
                <div className="mt-3">
                  <ActionButton 
                    variant="tail" 
                    onClick={() => setShowAll(true)}
                    className="h-10 text-base"
                  >
                    View All 50 Hottest Bettors
                  </ActionButton>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="cold" className="space-y-2">
            <div className="rounded-xl bg-card border border-white/10 p-2">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Rank</TableHead>
                      <TableHead>Bettor</TableHead>
                      <TableHead className="w-[80px]">Units down</TableHead>
                      <TableHead className="w-[60px]">Win %</TableHead>
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
                            <Award className="inline-block mr-1 text-yellow-500" size={14} />
                          )}
                          {index + 1}
                        </TableCell>
                        <TableCell>@{bettor.name}</TableCell>
                        <TableCell className="text-onetime-red">
                          {bettor.profit}u
                        </TableCell>
                        <TableCell>{bettor.winRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              {!showAll && (
                <div className="mt-3">
                  <ActionButton 
                    variant="fade" 
                    onClick={() => setShowAll(true)}
                    className="h-10 text-base"
                  >
                    View All 50 Coldest Bettors
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
