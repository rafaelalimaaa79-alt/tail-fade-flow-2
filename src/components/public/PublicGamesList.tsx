import React, { useState, useEffect } from "react";
import PublicGameItem from "./PublicGameItem";
import { supabase } from "@/integrations/supabase/client";
import { getOpponentTeam, parseGameName } from "@/utils/game-parser";

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
          let opponent = getOpponentTeam(row.game_name, row.team_public_is_on);
          
          // If getOpponentTeam fails, try to extract opponent from game_name directly
          if (!opponent) {
            const teams = parseGameName(row.game_name);
            if (teams) {
              // If we can parse teams, use the one that doesn't match team_public_is_on
              const teamPublicLower = (row.team_public_is_on || '').toLowerCase().trim();
              if (teams.awayTeam.toLowerCase().trim() !== teamPublicLower &&
                  teams.homeTeam.toLowerCase().trim() !== teamPublicLower) {
                // Neither matches exactly, try to find which one is NOT the public team
                if (teams.awayTeam.toLowerCase().includes(teamPublicLower) ||
                    teamPublicLower.includes(teams.awayTeam.toLowerCase())) {
                  opponent = teams.homeTeam;
                } else if (teams.homeTeam.toLowerCase().includes(teamPublicLower) ||
                           teamPublicLower.includes(teams.homeTeam.toLowerCase())) {
                  opponent = teams.awayTeam;
                } else {
                  // Default to home team if we can't determine
                  opponent = teams.homeTeam;
                }
              } else {
                // One of them matches, use the other
                opponent = teams.awayTeam.toLowerCase().trim() === teamPublicLower 
                  ? teams.homeTeam 
                  : teams.awayTeam;
              }
            }
          }
          
          // Final fallback - try to extract from game_name string directly
          if (!opponent) {
            const gameName = row.game_name || '';
            const teamPublic = row.team_public_is_on || '';
            
            // Try to find the other team by removing the public team from game name
            if (gameName.includes('@')) {
              const parts = gameName.split('@').map(s => s.trim());
              if (parts.length === 2) {
                opponent = parts[0].toLowerCase().includes(teamPublic.toLowerCase()) 
                  ? parts[1] 
                  : parts[0];
              }
            } else if (gameName.toLowerCase().includes(' vs ')) {
              const parts = gameName.split(/ vs /i).map(s => s.trim());
              if (parts.length === 2) {
                opponent = parts[0].toLowerCase().includes(teamPublic.toLowerCase()) 
                  ? parts[1] 
                  : parts[0];
              }
            }
          }
          
          return {
            id: row.id,
            team: row.team_public_is_on,
            opponent: opponent || 'Opponent',
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
