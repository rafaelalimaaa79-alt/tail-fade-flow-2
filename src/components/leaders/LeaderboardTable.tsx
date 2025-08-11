
import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Award, Crown, Star, Zap } from "lucide-react";

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
  variant: "fade";
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  bettors,
  variant,
}) => {
  const navigate = useNavigate();
  
  // Show 10 bettors
  const displayBettors = useMemo(() => 
    bettors.slice(0, 10),
  [bettors]);

  // Function to get rank icon based on position
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="inline-block mr-2 text-yellow-500 group-hover:animate-pulse" size={14} />;
    if (index === 1) return <Star className="inline-block mr-2 text-gray-400 group-hover:animate-pulse" size={12} />;
    if (index === 2) return <Zap className="inline-block mr-2 text-orange-500 group-hover:animate-pulse" size={12} />;
    if (index < 5) return <Award className="inline-block mr-2 text-yellow-600 group-hover:animate-pulse" size={10} />;
    return null;
  };

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => (
    displayBettors.map((bettor, index) => (
      <TableRow 
        key={bettor.id} 
        className="cursor-pointer hover:bg-muted/30 transition-all duration-300 group border-b border-white/10"
        onClick={() => navigate(`/bettor/${bettor.id}`)}
      >
        <TableCell className="font-medium w-16 py-3 px-3">
          {getRankIcon(index)}
          <span className="group-hover:text-white transition-colors duration-200 text-sm font-bold">
            {index + 1}
          </span>
        </TableCell>
        <TableCell className="py-3 px-3">
          <span className="group-hover:text-white transition-colors duration-200 text-base font-bold">
            @{bettor.name}
          </span>
        </TableCell>
        <TableCell className="text-[#FF5C5C] w-20 text-right py-3 px-3">
          <span className="group-hover:font-bold transition-all duration-200 text-sm font-bold">
            {bettor.profit}u
          </span>
        </TableCell>
        <TableCell className="w-16 text-right py-3 px-3">
          <span className="group-hover:text-white group-hover:font-bold transition-all duration-200 text-sm font-semibold">
            {100 - bettor.winRate}%
          </span>
        </TableCell>
      </TableRow>
    ))
  ), [displayBettors, navigate]);

  return (
    <div className="rounded-xl bg-card border border-white/10 p-3 transition-all duration-300 hover:border-white/20 hover:shadow-2xl backdrop-blur-sm overflow-hidden">
      <div className="w-full overflow-x-hidden">
        <Table className="w-full">
          <TableHeader className="bg-card/95 backdrop-blur-sm border-b border-white/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider">Rank</TableHead>
              <TableHead className="text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider">Bettor</TableHead>
              <TableHead className="w-20 text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider text-right">
                Down
              </TableHead>
              <TableHead className="w-16 text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider text-right">Lose %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </div>
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
