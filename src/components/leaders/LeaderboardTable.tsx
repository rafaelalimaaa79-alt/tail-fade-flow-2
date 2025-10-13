
import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Award, Crown, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { triggerHaptic } from "@/utils/haptic-feedback";

interface LeaderboardUser {
  id: string;
  username: string;
  totalBets: number;
  winRate: number;
  roi: number;
  unitsGained: number;
  confidenceScore: number | null;
  statline: string | null;
  isCurrentUser: boolean;
}

interface LeaderboardTableProps {
  bettors: LeaderboardUser[];
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  variant: "fade";
  loading?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  bettors,
  variant,
  loading = false,
}) => {
  const navigate = useNavigate();

  // Show 10 bettors
  const displayBettors = useMemo(() =>
    bettors.slice(0, 50), // Show up to 50 bettors
  [bettors]);

  // Function to get rank icon based on position
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="inline-block mr-2 text-yellow-500 group-hover:animate-pulse" size={14} />;
    if (index === 1) return <Star className="inline-block mr-2 text-gray-400 group-hover:animate-pulse" size={12} />;
    if (index === 2) return <Zap className="inline-block mr-2 text-orange-500 group-hover:animate-pulse" size={12} />;
    if (index < 5) return <Award className="inline-block mr-2 text-yellow-600 group-hover:animate-pulse" size={10} />;
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="rounded-xl bg-card border border-white/10 p-8 text-center">
        <p className="text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }

  // Empty state
  if (displayBettors.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-white/10 p-8 text-center">
        <p className="text-gray-400">No users found</p>
        <p className="text-sm text-gray-500 mt-2">Be the first to sync your bets!</p>
      </div>
    );
  }

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => (
    displayBettors.map((bettor, index) => (
      <TableRow
        key={bettor.id}
        className={`cursor-pointer hover:bg-muted/30 transition-all duration-300 group border-b border-white/10 ${
          bettor.isCurrentUser ? 'bg-[#AEE3F5]/10' : ''
        }`}
        onClick={() => {
          triggerHaptic('impactLight');
          navigate(`/bettor/${bettor.id}`);
        }}
      >
        <TableCell className="font-medium w-16 py-3 px-3">
          {getRankIcon(index)}
          <span className="group-hover:text-white transition-colors duration-200 text-sm font-bold">
            {index + 1}
          </span>
        </TableCell>
        <TableCell className="py-3 px-3">
          <div className="flex flex-col gap-1">
            <span className={`group-hover:text-white transition-colors duration-200 text-base font-bold ${
              bettor.isCurrentUser ? 'text-[#AEE3F5]' : ''
            }`}>
              @{bettor.username || `User${bettor.id.substring(0, 4)}`}
              {bettor.isCurrentUser && (
                <span className="ml-2 text-xs text-[#AEE3F5]">(You)</span>
              )}
            </span>
            {bettor.statline && (
              <span className="text-xs text-gray-400 italic">{bettor.statline}</span>
            )}
          </div>
        </TableCell>
        <TableCell className="py-3 px-3">
          {bettor.confidenceScore !== null ? (
            <Badge className="bg-onetime-red text-white text-xs">
              {Math.round(bettor.confidenceScore)}%
            </Badge>
          ) : (
            <Badge className="bg-gray-600 text-white text-xs">
              No Data
            </Badge>
          )}
        </TableCell>
        <TableCell className="text-[#FF5C5C] w-20 text-right py-3 px-3">
          <span className="group-hover:font-bold transition-all duration-200 text-sm font-bold">
            {Math.round(bettor.unitsGained / 100)}u
          </span>
        </TableCell>
        <TableCell className="w-16 text-right py-3 px-3">
          <span className="group-hover:text-white group-hover:font-bold transition-all duration-200 text-sm font-semibold">
            {bettor.winRate.toFixed(1)}%
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
              <TableHead className="text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider">Fade</TableHead>
              <TableHead className="w-20 text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider text-right">
                Down
              </TableHead>
              <TableHead className="w-16 text-muted-foreground py-3 px-3 text-xs font-bold uppercase tracking-wider text-right">Win %</TableHead>
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
