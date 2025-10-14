
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface UserHeaderProps {
  username: string;
  rank: number;
  rankChange: number;
}

const UserHeader: React.FC<UserHeaderProps> = ({ username, rank, rankChange }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white font-rajdhani tracking-wider neon-text">@{username}</h1>
        <div className="flex items-center gap-2">
          {rank > 0 ? (
            <>
              <span className="text-lg font-medium text-white">#{rank} Tail Ranking</span>
              {rankChange !== 0 && (
                <div className="flex items-center gap-1">
                  {rankChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-onetime-green" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-onetime-red" />
                  )}
                  <span className={`text-sm font-medium ${rankChange > 0 ? 'text-onetime-green' : 'text-onetime-red'}`}>
                    {Math.abs(rankChange)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <span className="text-sm font-medium text-white/60">Not Ranked</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
