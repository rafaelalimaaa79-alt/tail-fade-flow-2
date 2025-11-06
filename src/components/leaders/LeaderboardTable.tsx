import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Award, Crown, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardUser {
  id: string;
  username: string | null;
  totalBets: number;
  winRate: number;
  roi?: number;
  unitsGained?: number;
  confidenceScore?: number | null;
  statline?: string | null;
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
  const displayBettors = bettors.slice(0, 50);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [lastFiveBets, setLastFiveBets] = useState<Record<string, Array<{ result: string; id: string }>>>({});
  const [loadingBets, setLoadingBets] = useState<string | null>(null);

  const handleUserClick = async (bettor: LeaderboardUser) => {
    // If clicking the same user, collapse it
    if (expandedUserId === bettor.id) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(bettor.id);
    
    // If we already have the data, don't fetch again
    if (lastFiveBets[bettor.id]) {
      return;
    }

    setLoadingBets(bettor.id);
    
    try {
      const { data, error } = await supabase
        .from('bets')
        .select('id, result')
        .eq('user_id', bettor.id)
        .in('result', ['Win', 'Loss', 'Push'])
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      setLastFiveBets(prev => ({ ...prev, [bettor.id]: data || [] }));
    } catch (error) {
      console.error('Error fetching bets:', error);
      setLastFiveBets(prev => ({ ...prev, [bettor.id]: [] }));
    } finally {
      setLoadingBets(null);
    }
  };

  // Function to get rank icon based on position
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="inline-block mr-2 text-yellow-500" size={18} />;
    if (index === 1) return <Star className="inline-block mr-2 text-gray-400" size={16} />;
    if (index === 2) return <Zap className="inline-block mr-2 text-orange-500" size={14} />;
    if (index < 5) return <Award className="inline-block mr-2 text-yellow-600" size={12} />;
    return null;
  };

  // Function to get progressive sizing based on rank
  const getRowSize = (index: number) => {
    const sizes = [
      "py-6 text-xl", // Rank 1 - biggest
      "py-5 text-lg", // Rank 2
      "py-4 text-base", // Rank 3
      "py-3 text-base", // Rank 4-5
      "py-3 text-base",
      "py-2 text-sm", // Rank 6-10
      "py-2 text-sm",
      "py-2 text-sm",
      "py-2 text-sm",
      "py-2 text-sm"
    ];
    return sizes[index] || "py-2 text-sm";
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
        <TableHeader>
          <TableRow className="border-b border-white/10">
            <TableHead className="w-20 py-3 px-3 text-left text-xs font-semibold text-gray-400">
              Rank
            </TableHead>
            <TableHead className="py-3 px-3 text-center text-xs font-semibold text-gray-400">
              Bettor
            </TableHead>
            <TableHead className="w-24 py-3 px-3 text-right text-xs font-semibold text-gray-400">
              Win %
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayBettors.map((bettor, index) => (
            <React.Fragment key={bettor.id}>
              <TableRow
                className={`cursor-pointer hover:bg-muted/30 transition-all ${getRowSize(index)}`}
                onClick={() => handleUserClick(bettor)}
              >
                <TableCell className="font-medium w-20 px-3">
                  {getRankIcon(index)}
                  <span className="font-bold">
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell className="px-3 text-center">
                  <span className="font-bold">
                    @{bettor.username || `User${bettor.id.substring(0, 4)}`}
                    {bettor.isCurrentUser && (
                      <span className="ml-2 text-xs text-[#AEE3F5]">(You)</span>
                    )}
                  </span>
                </TableCell>
                <TableCell className="w-24 text-right px-3">
                  <span className="font-semibold text-[#FF5C5C]">
                    {bettor.winRate.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
              
              {expandedUserId === bettor.id && (
                <TableRow>
                  <TableCell colSpan={3} className="p-0">
                    <div className="bg-muted/20 border-t border-white/10 animate-fade-in">
                      <div className="py-4 px-6">
                        <p className="text-center text-sm text-gray-400 mb-3 font-semibold">Last 5</p>
                        <div className="flex justify-center gap-3">
                          {loadingBets === bettor.id ? (
                            <p className="text-gray-400 text-sm">Loading...</p>
                          ) : (lastFiveBets[bettor.id] || []).length === 0 ? (
                            <p className="text-gray-400 text-sm">No recent bets</p>
                          ) : (
                            (lastFiveBets[bettor.id] || []).map((bet) => (
                              <div
                                key={bet.id}
                                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
                                  bet.result === 'Win' 
                                    ? 'bg-white/20 text-white border-2 border-white' 
                                    : bet.result === 'Loss'
                                    ? 'bg-[#AEE3F5]/20 text-[#AEE3F5] border-2 border-[#AEE3F5]'
                                    : 'bg-gray-500/20 text-gray-500 border-2 border-gray-500'
                                }`}
                              >
                                {bet.result === 'Win' ? 'W' : bet.result === 'Loss' ? 'L' : 'P'}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
