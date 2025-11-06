import React, { useState, useEffect } from "react";
import PublicGameItem from "./PublicGameItem";
import { supabase } from "@/integrations/supabase/client";
import { getOpponentTeam } from "@/utils/game-parser";

interface PublicGame {
  id: string;
  team: string;
  opponent: string;
  publicPercentage: number;
  spread: string;
  sport: string;
  event: string;
  gameTime: string;
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

      const { data, error: fetchError } = await supabase
        .from('public_bets')
        .select('*')
        .eq('status', 'active')
        .order('public_percentage', { ascending: false });

      if (fetchError) {
        console.error('Error fetching public betting data:', fetchError);
        setError('Failed to load betting data');
        return;
      }

      if (data && Array.isArray(data)) {
        // Transform the data to match PublicGame interface
        const transformedGames: PublicGame[] = data.map((row: any) => {
          const opponent = getOpponentTeam(row.game_name, row.team_public_is_on) || 'Opponent';
          
          return {
            id: row.id,
            team: row.team_public_is_on,
            opponent: opponent,
            publicPercentage: row.public_percentage || 0,
            spread: row.spread || "",
            sport: row.sport || "",
            event: row.game_name,
            gameTime: row.game_date || ""
          };
        });

        // Sort by highest percentage (already sorted from query, but ensure it)
        setGames(transformedGames.sort((a, b) => b.publicPercentage - a.publicPercentage));
      } else {
        console.warn('Unexpected data format:', data);
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

    return () => {
      clearTimeout(initTimer);
    };
  }, [fetchPublicBettingData]);

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
            <span className="text-orange-400 font-bold"> 80%+</span> = Heavy Public
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicGamesList;
