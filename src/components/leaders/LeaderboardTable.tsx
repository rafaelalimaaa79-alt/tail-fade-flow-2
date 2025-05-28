
import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, TrendingUp, TrendingDown } from "lucide-react";

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
  
  // Always show only the first 10 bettors
  const displayBettors = useMemo(() => 
    bettors.slice(0, 10),
  [bettors]);

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => (
    displayBettors.map((bettor, index) => (
      <TableRow 
        key={bettor.id} 
        className="cursor-pointer hover:bg-muted/50 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:border-white/20 border border-transparent"
        onClick={() => navigate(`/bettor/${bettor.id}`)}
      >
        <TableCell className="font-medium relative">
          {index < 3 && (
            <Award className="inline-block mr-1 text-yellow-500 group-hover:animate-pulse" size={14} />
          )}
          <span className="group-hover:text-white transition-colors duration-200">
            {index + 1}
          </span>
          {index === 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </TableCell>
        <TableCell className="relative">
          <div className="flex items-center gap-2">
            <span className="group-hover:text-white transition-colors duration-200">
              @{bettor.name}
            </span>
            {isProfitPositive ? (
              <TrendingUp className="w-4 h-4 text-onetime-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
            ) : (
              <TrendingDown className="w-4 h-4 text-onetime-red opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
            )}
          </div>
        </TableCell>
        <TableCell className={`${isProfitPositive ? "text-onetime-green" : "text-onetime-red"} relative`}>
          <div className="flex items-center gap-1">
            <span className="group-hover:font-bold transition-all duration-200 transform group-hover:scale-110">
              {isProfitPositive ? `+${bettor.profit}u` : `${bettor.profit}u`}
            </span>
            <div className={`absolute -right-2 w-1 h-6 ${isProfitPositive ? "bg-onetime-green" : "bg-onetime-red"} opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-y-0 group-hover:scale-y-100`} />
          </div>
        </TableCell>
        <TableCell className="relative">
          <div className="flex items-center gap-2">
            <span className="group-hover:text-white group-hover:font-semibold transition-all duration-200">
              {bettor.winRate}%
            </span>
            <div className={`w-12 h-1 bg-gradient-to-r ${bettor.winRate >= 60 ? 'from-onetime-green to-onetime-green/50' : bettor.winRate >= 50 ? 'from-yellow-400 to-yellow-400/50' : 'from-onetime-red to-onetime-red/50'} opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 rounded-full`} />
          </div>
        </TableCell>
      </TableRow>
    ))
  ), [displayBettors, navigate, isProfitPositive]);

  return (
    <div className="rounded-xl bg-card border border-white/10 p-2 transition-all duration-300 hover:border-white/20 hover:shadow-xl">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] text-muted-foreground">Rank</TableHead>
              <TableHead className="text-muted-foreground">Bettor</TableHead>
              <TableHead className="w-[80px] text-muted-foreground">
                {isProfitPositive ? "Units up" : "Units down"}
              </TableHead>
              <TableHead className="w-[60px] text-muted-foreground">Win %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
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
