
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { BettorProfile } from "@/types/bettor";

type BettorHeaderProps = {
  profile: BettorProfile;
};

const BettorHeader: React.FC<BettorHeaderProps> = ({ profile }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-2 rounded-full p-1 hover:bg-gray-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold">@{profile.username}</h1>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-onetime-purple px-2 py-0.5">
              <span className="text-xs font-bold text-white">#{profile.tailRanking} Tail Ranking</span>
            </div>
            <Link 
              to="/leaders" 
              className="flex items-center text-xs text-onetime-purple"
            >
              View Full Rankings
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettorHeader;
