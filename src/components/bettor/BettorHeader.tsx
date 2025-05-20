
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { BettorProfile } from "@/types/bettor";
import { useIsMobile } from "@/hooks/use-mobile";

type BettorHeaderProps = {
  profile: BettorProfile;
};

const BettorHeader: React.FC<BettorHeaderProps> = ({ profile }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-4 rounded-xl bg-black/20 border border-white/10 p-3 shadow-md">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full p-1.5 bg-black/20 hover:bg-black/40 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">@{profile.username}</h1>
            
            <div 
              className="inline-flex items-center rounded-full bg-onetime-purple px-3 py-1 cursor-pointer hover:bg-opacity-90 transition-colors"
              onClick={() => navigate('/leaders')}
            >
              <span className="text-sm font-bold text-white">#{profile.tailRanking} Tail Ranking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettorHeader;
