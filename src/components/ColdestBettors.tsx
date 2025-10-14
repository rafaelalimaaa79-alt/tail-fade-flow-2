
import React, { useState, useEffect } from "react";
import BettorStreakItem from "./BettorStreakItem";
import { getColdestBettors, getCurrentUserId } from "@/services/userDataService";

interface ColdestBettor {
  id: string;
  name: string;
  profit: number;
  streak: number[];
}

const ColdestBettors = () => {
  const [coldestBettors, setColdestBettors] = useState<ColdestBettor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColdestBettors = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        const bettors = await getColdestBettors(10, currentUserId || undefined);
        setColdestBettors(bettors);
      } catch (error) {
        console.error('Error fetching coldest bettors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColdestBettors();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-4 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white/90">Ice Cold</h3>
        </div>
        <div className="text-center text-white/60 py-8">Loading...</div>
      </div>
    );
  }

  if (coldestBettors.length === 0) {
    return (
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-4 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white/90">Ice Cold</h3>
        </div>
        <div className="text-center text-white/60 py-8">No unprofitable bettors yet</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
      <div className="mb-4 flex items-center justify-center">
        <h3 className="text-lg font-bold text-white/90">Ice Cold</h3>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {coldestBettors.map((bettor) => (
          <BettorStreakItem
            key={bettor.id}
            id={bettor.id}
            name={bettor.name}
            profit={bettor.profit}
            streak={bettor.streak}
          />
        ))}
      </div>
    </div>
  );
};

export default ColdestBettors;
