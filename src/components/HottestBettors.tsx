
import React, { useState, useEffect } from "react";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import { useNavigate } from "react-router-dom";
import { getHottestBettors, getCurrentUserId } from "@/services/userDataService";

interface HottestBettor {
  id: string;
  name: string;
  profit: number;
  streak: number[];
}

const HottestBettors = () => {
  const navigate = useNavigate();
  const [hottestBettors, setHottestBettors] = useState<HottestBettor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHottestBettors = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        const bettors = await getHottestBettors(5, currentUserId || undefined);
        setHottestBettors(bettors);
      } catch (error) {
        console.error('Error fetching hottest bettors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHottestBettors();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-4 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white/90">On a Heater</h3>
        </div>
        <div className="text-center text-white/60 py-8">Loading...</div>
      </div>
    );
  }

  if (hottestBettors.length === 0) {
    return (
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-4 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white/90">On a Heater</h3>
        </div>
        <div className="text-center text-white/60 py-8">No profitable bettors yet</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
      <div className="mb-4 flex items-center justify-center">
        <h3 className="text-lg font-bold text-white/90">On a Heater</h3>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {hottestBettors.map((bettor) => (
          <BettorStreakItem
            key={bettor.id}
            id={bettor.id}
            name={bettor.name}
            profit={bettor.profit}
            streak={bettor.streak}
          />
        ))}
      </div>

      <ActionButton
        variant="fade"
        className="mt-4 h-10 text-sm"
        onClick={() => navigate("/leaders?type=hot")}
      >
        View Hottest Bettors
      </ActionButton>
    </div>
  );
};

export default HottestBettors;
