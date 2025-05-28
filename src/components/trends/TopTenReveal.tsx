
import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface TopBet {
  id: string;
  rank: number;
  bettor: string;
  bet: string;
  confidence: number;
  sport: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

interface TopTenRevealProps {
  isRevealed: boolean;
}

const TopTenReveal: React.FC<TopTenRevealProps> = ({ isRevealed }) => {
  const [revealedItems, setRevealedItems] = useState<number>(0);
  const [topBets, setTopBets] = useState<TopBet[]>([]);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);

  // Mock data for Top 10 bets
  const mockTopBets: TopBet[] = [
    { id: '1', rank: 1, bettor: 'SharpSniper17', bet: 'Lakers -6.5', confidence: 94, sport: 'NBA' },
    { id: '2', rank: 2, bettor: 'MoneyMaker22', bet: 'Chiefs ML', confidence: 91, sport: 'NFL' },
    { id: '3', rank: 3, bettor: 'CourtVision', bet: 'Warriors O 225.5', confidence: 89, sport: 'NBA' },
    { id: '4', rank: 4, bettor: 'IceInVeins', bet: 'Rangers ML', confidence: 87, sport: 'NHL' },
    { id: '5', rank: 5, bettor: 'StatMaster', bet: 'Dodgers -1.5', confidence: 85, sport: 'MLB' },
    { id: '6', rank: 6, bettor: 'BetGenius', bet: 'Celtics U 218.5', confidence: 83, sport: 'NBA' },
    { id: '7', rank: 7, bettor: 'GoldRush88', bet: 'Cowboys +3.5', confidence: 81, sport: 'NFL' },
    { id: '8', rank: 8, bettor: 'SharpShooter', bet: 'Knicks ML', confidence: 79, sport: 'NBA' },
    { id: '9', rank: 9, bettor: 'VegasVibes', bet: 'Bruins -1.5', confidence: 77, sport: 'NHL' },
    { id: '10', rank: 10, bettor: 'ClutchBets', bet: 'Yankees O 8.5', confidence: 75, sport: 'MLB' },
  ];

  useEffect(() => {
    if (isRevealed) {
      setShowRevealAnimation(true);
      setTopBets(mockTopBets);
      
      // Reveal items one by one with delay
      const revealTimer = setInterval(() => {
        setRevealedItems(prev => {
          if (prev < 10) {
            return prev + 1;
          } else {
            clearInterval(revealTimer);
            return prev;
          }
        });
      }, 200);

      return () => clearInterval(revealTimer);
    }
  }, [isRevealed]);

  // Simulate dynamic updates
  useEffect(() => {
    if (isRevealed && revealedItems === 10) {
      const updateTimer = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance of update every 30 seconds
          setTopBets(prev => prev.map((bet, index) => 
            index < 3 && Math.random() < 0.3 ? { ...bet, isUpdated: true } : bet
          ));
          
          // Clear update flags after 3 seconds
          setTimeout(() => {
            setTopBets(prev => prev.map(bet => ({ ...bet, isUpdated: false })));
          }, 3000);
        }
      }, 30000);

      return () => clearInterval(updateTimer);
    }
  }, [isRevealed, revealedItems]);

  if (!isRevealed) {
    return null;
  }

  return (
    <div className="space-y-6">
      {showRevealAnimation && (
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TOP 10 BETS OF THE DAY
            </h1>
            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
          </div>
          <p className="text-lg text-gray-300">Based on real-time confidence scoring</p>
        </div>
      )}

      <div className="grid gap-4">
        {topBets.slice(0, revealedItems).map((bet, index) => (
          <Card 
            key={bet.id}
            className={cn(
              "p-4 bg-gradient-to-r transition-all duration-500 transform",
              index < 3 ? "from-yellow-500/20 to-orange-500/20 border-yellow-500/50" : 
              index < 6 ? "from-gray-500/20 to-gray-600/20 border-gray-500/50" :
              "from-gray-600/20 to-gray-700/20 border-gray-600/50",
              "animate-scale-in",
              bet.isUpdated && "animate-glow-pulse-purple"
            )}
            style={{
              animationDelay: `${index * 200}ms`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg",
                  index < 3 ? "bg-yellow-500 text-black" :
                  index < 6 ? "bg-gray-500 text-white" :
                  "bg-gray-600 text-white"
                )}>
                  #{bet.rank}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg text-white">{bet.bettor}</h3>
                    {bet.isUpdated && (
                      <span className="bg-onetime-purple text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        UPDATED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300">{bet.bet}</p>
                  <p className="text-sm text-gray-400">{bet.sport}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-400">{bet.confidence}%</span>
                </div>
                <p className="text-sm text-gray-400">Confidence</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {revealedItems === 10 && (
        <div className="text-center mt-8 p-4 bg-onetime-purple/20 rounded-lg border border-onetime-purple/50">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-onetime-purple animate-pulse" />
            <span className="text-onetime-purple font-semibold">LIVE UPDATES ENABLED</span>
            <Zap className="h-5 w-5 text-onetime-purple animate-pulse" />
          </div>
          <p className="text-sm text-gray-400">
            This list updates automatically when stronger bets emerge before games begin
          </p>
        </div>
      )}
    </div>
  );
};

export default TopTenReveal;
