import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ActionButton from "./ActionButton";
import { BetterPlay } from "@/types/betTypes";
import { showFadeNotification } from "@/utils/betting-notifications";
import { Button } from "@/components/ui/button";

interface PlayCardProps {
  play: BetterPlay;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
  onActionClick?: () => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ play, renderWaveText, onActionClick }) => {
  // Function to get a random opposing team based on the sport
  const getRandomOpposingTeam = (originalBet: string) => {
    // Extract sport-specific teams
    const nbaTeams = ['Lakers', 'Celtics', 'Warriors', 'Heat', 'Bucks', 'Nets', '76ers', 'Nuggets', 'Suns', 'Mavericks'];
    const mlbTeams = ['Yankees', 'Dodgers', 'Red Sox', 'Astros', 'Braves', 'Mets', 'Angels', 'Giants', 'Cubs', 'Cardinals'];
    const nflTeams = ['Chiefs', 'Eagles', 'Cowboys', 'Bills', '49ers', 'Packers', 'Steelers', 'Patriots', 'Rams', 'Bengals'];
    const nhlTeams = ['Bruins', 'Lightning', 'Avalanche', 'Oilers', 'Rangers', 'Capitals', 'Penguins', 'Kings', 'Flames', 'Stars'];
    
    // Determine sport based on team in the bet
    let teams = nbaTeams; // default
    
    if (nflTeams.some(team => originalBet.includes(team))) {
      teams = nflTeams;
    } else if (mlbTeams.some(team => originalBet.includes(team))) {
      teams = mlbTeams;
    } else if (nhlTeams.some(team => originalBet.includes(team))) {
      teams = nhlTeams;
    }
    
    // Find teams that aren't in the original bet
    const availableTeams = teams.filter(team => !originalBet.includes(team));
    
    // Return a random team from available teams
    return availableTeams[Math.floor(Math.random() * availableTeams.length)];
  };

  // Function to extract the team from the bet
  const getTeamFromBet = (bet: string) => {
    const nbaTeams = ['Lakers', 'Celtics', 'Warriors', 'Heat', 'Bucks', 'Nets', '76ers', 'Nuggets', 'Suns', 'Mavericks'];
    const mlbTeams = ['Yankees', 'Dodgers', 'Red Sox', 'Astros', 'Braves', 'Mets', 'Angels', 'Giants', 'Cubs', 'Cardinals'];
    const nflTeams = ['Chiefs', 'Eagles', 'Cowboys', 'Bills', '49ers', 'Packers', 'Steelers', 'Patriots', 'Rams', 'Bengals'];
    const nhlTeams = ['Bruins', 'Lightning', 'Avalanche', 'Oilers', 'Rangers', 'Capitals', 'Penguins', 'Kings', 'Flames', 'Stars'];
    
    const allTeams = [...nbaTeams, ...mlbTeams, ...nflTeams, ...nhlTeams];
    return allTeams.find(team => bet.includes(team)) || 'Team';
  };

  // Use useMemo to prevent the random team from changing on every render
  const { oppositeBet, gameMatchup } = useMemo(() => {
    const randomOpposingTeam = getRandomOpposingTeam(play.bet);
    const currentTeam = getTeamFromBet(play.bet);
    
    const matchup = `${currentTeam} vs ${randomOpposingTeam}`;
    
    let bet;
    if (play.bet.includes('ML')) {
      bet = `${randomOpposingTeam} ML`;
    } else if (play.bet.includes('-') || play.bet.includes('+')) {
      bet = `${randomOpposingTeam} ML`;
    } else if (play.bet.toLowerCase().includes('over')) {
      bet = `Under ${play.bet.split(' ').pop()}`;
    } else if (play.bet.toLowerCase().includes('under')) {
      bet = `Over ${play.bet.split(' ').pop()}`;
    } else {
      bet = `${randomOpposingTeam} ML`;
    }
    
    return { oppositeBet: bet, gameMatchup: matchup };
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
              textShadow: '0 0 5px #AEE3F5, 0 0 15px #AEE3F5'
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
        
        {/* Fade confidence */}
        <div className="text-center py-1">
          <p className="text-lg font-semibold text-gray-300">
            Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
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
