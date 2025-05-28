
import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, TrendingUp, TrendingDown, Crown, Star, Zap } from "lucide-react";

interface BettorData {
  id: string;
  name: string;
  profit: number;
  winRate: number;
  streak: number;
}

interface LeaderboardTableProps {
  bettors: BettorData[];
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  variant: "tail" | "fade";
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  bettors,
  variant,
}) => {
  const navigate = useNavigate();
  const isProfitPositive = variant === "tail";
  
  // Show 20 bettors instead of 10 for a longer table
  const displayBettors = useMemo(() => 
    bettors.slice(0, 20),
  [bettors]);

  // Function to get rank icon based on position
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="inline-block mr-1 text-yellow-500 group-hover:animate-pulse" size={14} />;
    if (index === 1) return <Star className="inline-block mr-1 text-gray-400 group-hover:animate-pulse" size={12} />;
    if (index === 2) return <Zap className="inline-block mr-1 text-orange-500 group-hover:animate-pulse" size={12} />;
    if (index < 5) return <Award className="inline-block mr-1 text-yellow-600 group-hover:animate-pulse" size={10} />;
    return null;
  };

  // Function to get rank styling based on position
  const getRankStyling = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
    if (index === 1) return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
    if (index === 2) return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30";
    if (index < 5) return "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20";
    return "border-white/10";
  };

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => (
    displayBettors.map((bettor, index) => (
      <TableRow 
        key={bettor.id} 
        className={`cursor-pointer hover:bg-muted/50 transition-all duration-300 group hover:scale-[1.01] hover:shadow-lg hover:border-white/30 border ${getRankStyling(index)}`}
        onClick={() => navigate(`/bettor/${bettor.id}`)}
      >
        <TableCell className="font-medium relative w-16 p-3">
          {getRankIcon(index)}
          <span className="group-hover:text-white transition-colors duration-200 text-sm font-semibold">
            {index + 1}
          </span>
          {index === 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </TableCell>
        <TableCell className="relative p-3 flex-1">
          <span className="group-hover:text-white transition-colors duration-200 text-sm font-medium truncate block max-w-full">
            @{bettor.name}
          </span>
        </TableCell>
        <TableCell className={`${isProfitPositive ? "text-onetime-green" : "text-onetime-red"} relative p-3 w-20 text-right`}>
          <span className="group-hover:font-bold transition-all duration-200 transform group-hover:scale-110 text-sm font-semibold">
            {isProfitPositive ? `+${bettor.profit}u` : `${bettor.profit}u`}
          </span>
        </TableCell>
        <TableCell className="relative p-3 w-20 text-right">
          <span className="group-hover:text-white group-hover:font-semibold transition-all duration-200 text-sm font-medium">
            {bettor.winRate}%
          </span>
        </TableCell>
      </TableRow>
    ))
  ), [displayBettors, navigate, isProfitPositive]);

  return (
    <div className="rounded-xl bg-card border border-white/10 p-3 transition-all duration-300 hover:border-white/20 hover:shadow-2xl backdrop-blur-sm overflow-hidden">
      <ScrollArea className="h-[600px] w-full overflow-x-hidden">
        <div className="w-full overflow-x-hidden">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-white/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 text-muted-foreground p-3 text-xs font-bold uppercase tracking-wider">Rank</TableHead>
                <TableHead className="text-muted-foreground p-3 text-xs font-bold uppercase tracking-wider">Bettor</TableHead>
                <TableHead className="w-20 text-muted-foreground p-3 text-xs font-bold uppercase tracking-wider text-right">
                  {isProfitPositive ? "Units" : "Down"}
                </TableHead>
                <TableHead className="w-20 text-muted-foreground p-3 text-xs font-bold uppercase tracking-wider text-right">Win %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

// Use React.memo with a custom comparison function for detailed control over re-renders
export default memo(LeaderboardTable, (prevProps, nextProps) => {
  // Only re-render if any of these props changed
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.bettors === nextProps.bettors
  );
});
