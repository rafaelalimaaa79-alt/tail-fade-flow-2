
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
    <div className="mb-2">
      <div className="flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-2 rounded-full p-1 hover:bg-gray-100"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-1 items-center justify-between">
          <div 
            className="inline-block cursor-pointer rounded-full bg-onetime-purple px-2 py-0.5"
            onClick={() => navigate('/leaders')}
          >
            <span className="text-xs font-bold text-white">#{profile.tailRanking} Tail Ranking</span>
          </div>
          <h1 className="text-xl font-bold">@{profile.username}</h1>
        </div>
      </div>
    </div>
  );
};

export default BettorHeader;
