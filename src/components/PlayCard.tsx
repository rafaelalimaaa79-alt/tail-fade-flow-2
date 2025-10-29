
import React, { useMemo } from "react";
import { BetterPlay } from "@/types/betTypes";
import { showFadeNotification } from "@/utils/betting-notifications";
import { getOppositeBet } from "@/utils/bet-conversion";
import { Button } from "@/components/ui/button";

interface PlayCardProps {
  play: BetterPlay;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
  onActionClick?: () => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ play, renderWaveText, onActionClick }) => {
  // Function to get the actual opposing team from real games data
  const getActualMatchup = (bet: string) => {
    // Real matchups from your exact games data - maintaining correct order
    const realMatchups = {
      'LSU': 'Clemson',
      'Clemson': 'LSU',
      'Ohio State': 'Texas',
      'Texas': 'Ohio State', 
      'Alabama': 'Florida State',
      'Florida State': 'Alabama',
      'Auburn': 'Baylor',
      'Baylor': 'Auburn',
      'Tennessee': 'Syracuse',
      'Syracuse': 'Tennessee',
      'Notre Dame': 'Miami',
      'Miami': 'Notre Dame',
      'South Carolina': 'Virginia Tech',
      'Virginia Tech': 'South Carolina',
      'North Carolina': 'TCU',
      'TCU': 'North Carolina',
      'Eagles': 'Cowboys',
      'Cowboys': 'Eagles',
      'Chiefs': 'Chargers',
      'Chargers': 'Chiefs',
      'Bengals': 'Browns',
      'Browns': 'Bengals',
      'Steelers': 'Jets',
      'Jets': 'Steelers',
      '49ers': 'Seahawks',
      'Seahawks': '49ers',
      'Dolphins': 'Bills',
      'Bills': 'Dolphins'
    };

    // Extract team from bet
    const allTeams = Object.keys(realMatchups);
    const currentTeam = allTeams.find(team => bet.includes(team));
    
    if (currentTeam && realMatchups[currentTeam as keyof typeof realMatchups]) {
      const opponent = realMatchups[currentTeam as keyof typeof realMatchups];
      return {
        currentTeam,
        opponent,
        matchup: `${currentTeam} vs ${opponent}`
      };
    }
    
    // Fallback if team not found
    return {
      currentTeam: 'Team',
      opponent: 'Opponent',
      matchup: 'Team vs Opponent'
    };
  };

  // Use useMemo to prevent the data from changing on every render
  const { oppositeBet, gameMatchup } = useMemo(() => {
    const { currentTeam, opponent, matchup } = getActualMatchup(play.bet);
    
    // Use the proper bet conversion function
    const oppositeBet = getOppositeBet(play.bet, opponent);
    
    return { oppositeBet, gameMatchup: matchup };
  }, [play.bet]);

  // Handle the bet action with notification only
  const handleBetClick = () => {
    showFadeNotification(play.bettorName, oppositeBet);
  };

  // Use the percentage from the play data instead of random generation
  const fadeConfidence = play.percentage;
  
  return (
    <div className="block mb-4">
      {/* FADE WATCH Header */}
      <div className="mb-4 text-center">
        <h2 className="font-exo text-4xl font-bold text-[#AEE3F5] tracking-wider uppercase neon-text" 
            style={{
              textShadow: '0 0 3px #AEE3F5, 0 0 8px #AEE3F5'
            }}>
          FADE WATCH
        </h2>
      </div>
      
      <div 
        className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 animate-glow-pulse space-y-2 flex-grow flex flex-col min-h-[280px]"
        style={{
          boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
        }}
      >
        {/* Game header with solid icy blue underline */}
        <div className="text-center pb-1">
          <h3 className="text-2xl font-bold text-white relative inline-block">
            {gameMatchup}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
          </h3>
        </div>
        
        {/* Bettor's pick */}
        <div className="text-center py-1">
          <p className="text-lg font-bold">
            <span className="text-[#AEE3F5]">@{play.bettorName}</span>
            <span className="text-white"> is on {play.bet}</span>
          </p>
        </div>
        
        {/* Record statline */}
        <div className="text-center py-1">
          <p className="text-lg font-medium text-gray-400 italic">
            He is {play.record}
          </p>
        </div>
        
        {/* Divider line */}
        <div className="flex justify-center py-1">
          <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
        </div>
        
        {/* Fade confidence and Users Fading */}
        <div className="flex items-center justify-between px-4 py-1">
          <p className="text-lg font-semibold text-gray-300">
            Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
          </p>
          <p className="text-lg font-semibold text-gray-300">
            Users Fading: <span className="text-[#AEE3F5] font-bold">0</span>
          </p>
        </div>
        
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        
        {/* Bet button with opposite bet */}
        <div className="w-full pt-1">
          <Button 
            className="w-full py-4 rounded-xl transition-all duration-300 text-lg font-bold bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
            style={{
              boxShadow: "0 0 20px rgba(174, 227, 245, 0.8), 0 0 40px rgba(174, 227, 245, 0.4)"
            }}
            onClick={handleBetClick}
          >
            Bet {oppositeBet}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayCard;
