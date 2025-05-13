
import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButton from "@/components/ActionButton";
import { Award } from "lucide-react";

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
  showAll,
  setShowAll,
  variant,
}) => {
  const navigate = useNavigate();
  const displayBettors = showAll ? bettors : bettors.slice(0, 10);
  const isProfitPositive = variant === "tail";

  return (
    <div className="rounded-xl bg-card border border-white/10 p-2">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Rank</TableHead>
              <TableHead>Bettor</TableHead>
              <TableHead className="w-[80px]">
                {isProfitPositive ? "Units up" : "Units down"}
              </TableHead>
              <TableHead className="w-[60px]">Win %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayBettors.map((bettor, index) => (
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
                <TableCell className={isProfitPositive ? "text-onetime-green" : "text-onetime-red"}>
                  {isProfitPositive ? `+${bettor.profit}u` : `${bettor.profit}u`}
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
            variant={variant} 
            onClick={() => setShowAll(true)}
            className="h-10 text-base"
          >
            View All 50 {variant === "tail" ? "Hottest" : "Coldest"} Bettors
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
