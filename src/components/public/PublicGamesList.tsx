import React, { useState, useEffect } from "react";
import PublicGameItem from "./PublicGameItem";

interface PublicGame {
  id: string;
  team: string;
  opponent: string;
  publicPercentage: number;
  totalBets: number;
  gameTime: string;
  isLive: boolean;
  spread: string;
  sport: string;
}

// Mock data - in production this would come from your API
const mockPublicGames: PublicGame[] = [
  {
    id: "1",
    team: "Lakers",
    opponent: "Warriors",
    publicPercentage: 87,
    totalBets: 1247,
    gameTime: "2024-06-03T20:00:00Z",
    isLive: false,
    spread: "-5",
    sport: "NBA"
  },
  {
    id: "2",
    team: "Chiefs",
    opponent: "Broncos",
    publicPercentage: 82,
    totalBets: 2156,
    gameTime: "2024-06-03T18:30:00Z",
    isLive: true,
    spread: "-7.5",
    sport: "NFL"
  },
  {
    id: "3",
    team: "Celtics",
    opponent: "Heat",
    publicPercentage: 79,
    totalBets: 934,
    gameTime: "2024-06-03T21:30:00Z",
    isLive: false,
    spread: "-3",
    sport: "NBA"
  },
  {
    id: "4",
    team: "Yankees",
    opponent: "Red Sox",
    publicPercentage: 76,
    totalBets: 567,
    gameTime: "2024-06-03T19:00:00Z",
    isLive: false,
    spread: "-1.5",
    sport: "MLB"
  },
  {
    id: "5",
    team: "Rangers",
    opponent: "Islanders",
    publicPercentage: 74,
    totalBets: 423,
    gameTime: "2024-06-03T20:30:00Z",
    isLive: false,
    spread: "-1",
    sport: "NHL"
  },
  {
    id: "6",
    team: "Cowboys",
    opponent: "Eagles",
    publicPercentage: 71,
    totalBets: 1834,
    gameTime: "2024-06-03T22:00:00Z",
    isLive: false,
    spread: "-3.5",
    sport: "NFL"
  },
  {
    id: "7",
    team: "Dodgers",
    opponent: "Padres",
    publicPercentage: 68,
    totalBets: 789,
    gameTime: "2024-06-03T17:00:00Z",
    isLive: true,
    spread: "-2",
    sport: "MLB"
  }
];

const PublicGamesList = () => {
  const [games, setGames] = useState<PublicGame[]>([]);

  useEffect(() => {
    // Sort games by public percentage (highest first)
    const sortedGames = [...mockPublicGames].sort((a, b) => b.publicPercentage - a.publicPercentage);
    setGames(sortedGames);

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => ({
          ...game,
          publicPercentage: Math.round(Math.max(50, Math.min(95, game.publicPercentage + (Math.random() - 0.5) * 4))),
          totalBets: game.totalBets + Math.floor(Math.random() * 20)
        }));
        return updatedGames.sort((a, b) => b.publicPercentage - a.publicPercentage);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {/* Games List */}
      <div className="space-y-3">
        {games.map((game, index) => (
          <PublicGameItem 
            key={game.id} 
            game={game} 
            rank={index + 1}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#AEE3F5]/10 to-[#AEE3F5]/5 rounded-lg border border-[#AEE3F5]/20">
        <div className="text-center">
          <div className="text-[#AEE3F5] font-bold text-sm mb-1">
            🔥 Fade Strategy Alert 🔥
          </div>
          <p className="text-sm text-white/70">
            <span className="text-red-400 font-bold">90%+</span> = Extreme Public • 
            <span className="text-orange-400 font-bold"> 80%+</span> = Heavy Public • 
            Updates every 30s
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicGamesList;
