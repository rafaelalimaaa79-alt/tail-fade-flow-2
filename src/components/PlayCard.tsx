
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ActionButton from "./ActionButton";
import { BetterPlay } from "@/types/betTypes";
import { showFadeNotification } from "@/utils/betting-notifications";

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
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Header */}
      <div className="mb-5 border-b border-white/10 pb-3">
        <h2 className="font-exo text-4xl font-bold text-[#AEE3F5] text-center tracking-wider uppercase neon-text" 
            style={{
              textShadow: '0 0 5px #AEE3F5, 0 0 15px #AEE3F5'
            }}>
          FADE WATCH
        </h2>
        
        {/* Game Matchup Mini Header */}
        <div className="mt-3 text-center">
          <p className="text-lg font-semibold text-white/80 tracking-wide">
            {gameMatchup}
          </p>
        </div>
      </div>
      
      {/* Bettor's pick */}
      <div className="text-center mb-4">
        <p className="text-xl font-bold">
          <span className="text-[#AEE3F5]">@{play.bettorName}</span>
          <span className="text-white"> is on {play.bet}</span>
        </p>
      </div>
      
      {/* Record statline */}
      <div className="text-center mb-4">
        <p className="text-lg font-medium text-gray-400 italic">
          He is {play.record}
        </p>
      </div>
      
      {/* Fade confidence */}
      <div className="text-center mb-5">
        <p className="text-lg font-semibold text-gray-300">
          Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
        </p>
      </div>
      
      {/* Fading Users Count - Clean display without blocks */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white/70 font-medium text-base">Fading Users:</span>
          <span className="text-white font-bold text-xl text-primary">
            {play.userCount}
          </span>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="rounded-lg bg-muted p-4 text-center border border-white/10 shadow-lg">
        <ActionButton 
          variant="fade"
          className="h-12 text-lg font-bold"
          onClick={handleBetClick}
        >
          Bet {oppositeBet}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
