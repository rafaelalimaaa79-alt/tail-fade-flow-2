
import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Award, Crown, Star, Zap } from "lucide-react";

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
  loading = false,
}) => {
  const navigate = useNavigate();
  const displayBettors = bettors.slice(0, 50);

  // Function to get rank icon based on position
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="inline-block mr-2 text-yellow-500" size={14} />;
    if (index === 1) return <Star className="inline-block mr-2 text-gray-400" size={12} />;
    if (index === 2) return <Zap className="inline-block mr-2 text-orange-500" size={12} />;
    if (index < 5) return <Award className="inline-block mr-2 text-yellow-600" size={10} />;
    return null;
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-card border border-white/10 p-8 text-center">
        <p className="text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }

  if (displayBettors.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-white/10 p-8 text-center">
        <p className="text-gray-400">No users found</p>
        <p className="text-sm text-gray-500 mt-2">Be the first to sync your bets!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-white/10 p-2">
      <Table>
        <TableBody>
          {displayBettors.map((bettor, index) => (
            <TableRow
              key={bettor.id}
              className="cursor-pointer hover:bg-muted/30"
              onClick={() => navigate(`/bettor/${bettor.id}`)}
            >
              <TableCell className="font-medium w-16 py-3 px-3">
                {getRankIcon(index)}
                <span className="text-sm font-bold">
                  {index + 1}
                </span>
              </TableCell>
              <TableCell className="py-3 px-3">
                <span className="text-base font-bold">
                  @{bettor.username || `User${bettor.id.substring(0, 4)}`}
                  {bettor.isCurrentUser && (
                    <span className="ml-2 text-xs text-[#AEE3F5]">(You)</span>
                  )}
                </span>
              </TableCell>
              <TableCell className="text-[#FF5C5C] w-20 text-right py-3 px-3">
                <span className="text-sm font-bold">
                  {Math.round(bettor.unitsGained / 100)}u
                </span>
              </TableCell>
              <TableCell className="w-16 text-right py-3 px-3">
                <span className="text-sm font-semibold">
                  {bettor.winRate.toFixed(1)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
