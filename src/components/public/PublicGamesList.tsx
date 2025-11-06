import React, { useState, useEffect } from "react";
import PublicGameItem from "./PublicGameItem";
import { supabase } from "@/integrations/supabase/client";

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
  event: string;
  marketType: 'spread' | 'moneyline' | 'total';
  line: string;
  betType: string;
}

const PublicGamesList = () => {
  const [games, setGames] = useState<PublicGame[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicBettingData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.functions.invoke('get-public-betting-data', {
        body: {
          limit: 50
        }
      });

      if (fetchError) {
        console.error('Error fetching public betting data:', fetchError);
        setError('Failed to load betting data');
        return;
      }

      if (data?.games && Array.isArray(data.games)) {
        // Transform the data to match PublicGame interface
        const transformedGames: PublicGame[] = data.games.map((game: any) => ({
          id: game.id,
          team: game.team,
          opponent: game.opponent,
          publicPercentage: game.publicPercentage || 0,
          totalBets: game.totalBets || 0,
          gameTime: game.event_start_time,
          isLive: game.isLive || false,
          spread: game.line || "",
          sport: game.sport || "",
          event: game.event || "",
          marketType: game.marketType || 'spread',
          line: game.line || "",
          betType: game.betType || game.marketType || 'spread'
        }));

        // Sort by highest percentage (already sorted from API, but ensure it)
        setGames(transformedGames.sort((a, b) => b.publicPercentage - a.publicPercentage));
      } else {
        console.warn('Unexpected data format from API:', data);
        setError('Invalid data format');
      }
    } catch (err) {
      console.error('Error in fetchPublicBettingData:', err);
      setError('Failed to load betting data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchPublicBettingData();

    // Add a small delay to let the page settle before enabling effects
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    // Refresh data every 15 minutes (900000ms)
    const interval = setInterval(() => {
      if (isInitialized) {
        fetchPublicBettingData();
      }
    }, 900000); // 15 minutes

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [isInitialized, fetchPublicBettingData]);

  if (loading && games.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-8">
          <div className="text-[#AEE3F5] text-lg">Loading betting data...</div>
        </div>
      </div>
    );
  }

  if (error && games.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-8">
          <div className="text-red-400 text-lg mb-2">{error}</div>
          <button
            onClick={fetchPublicBettingData}
            className="px-4 py-2 bg-[#AEE3F5] text-black rounded-lg font-semibold hover:bg-[#AEE3F5]/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-8">
          <div className="text-white/70 text-lg">No upcoming games with betting data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Games List */}
      <div className="space-y-3">
        {games.map((game, index) => (
          <PublicGameItem 
            key={game.id} 
            game={game} 
            rank={index + 1}
            isInitialized={isInitialized}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-6 p-4 bg-black rounded-lg border border-[#AEE3F5]/20">
        <div className="text-center">
          <div className="text-[#AEE3F5] font-bold text-sm mb-1">
            🔥 Fade Strategy Alert 🔥
          </div>
          <p className="text-sm text-white/70">
            <span className="text-red-400 font-bold">90%+</span> = Extreme Public • 
            <span className="text-orange-400 font-bold"> 80%+</span> = Heavy Public • 
            Updates every 15 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicGamesList;
