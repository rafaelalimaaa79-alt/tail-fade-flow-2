
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  onCountdownEnd: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    hasEnded: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, hasEnded: false });

  const getNextEndTime = () => {
    const now = new Date();
    const cstOffset = -6 * 60; // CST is UTC-6
    const nowInCST = new Date(now.getTime() + (cstOffset + now.getTimezoneOffset()) * 60000);
    
    const dayOfWeek = nowInCST.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Create target time for today
    const targetTime = new Date(nowInCST);
    
    if (isWeekend) {
      // Weekend: 10:00 AM CST
      targetTime.setHours(10, 0, 0, 0);
    } else {
      // Weekday: 5:00 PM CST
      targetTime.setHours(17, 0, 0, 0);
    }
    
    // If we've passed today's target time, move to next day
    if (nowInCST > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
      const nextDayOfWeek = targetTime.getDay();
      const nextIsWeekend = nextDayOfWeek === 0 || nextDayOfWeek === 6;
      
      if (nextIsWeekend) {
        targetTime.setHours(10, 0, 0, 0);
      } else {
        targetTime.setHours(17, 0, 0, 0);
      }
    }
    
    // Convert back to local time
    return new Date(targetTime.getTime() - (cstOffset + now.getTimezoneOffset()) * 60000);
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endTime = getNextEndTime();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, hasEnded: true });
        onCountdownEnd();
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds, hasEnded: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [onCountdownEnd]);

  if (timeLeft.hasEnded) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-onetime-purple to-onetime-orange p-6 rounded-lg mb-6 text-white">
      <div className="flex items-center justify-center space-x-4">
        <Clock className="h-8 w-8 animate-pulse" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Next Top 10 Reveal</h2>
          <div className="flex space-x-4 text-3xl font-mono">
            <div className="bg-black/30 px-4 py-2 rounded">
              <span className="block text-sm opacity-75">Hours</span>
              <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded">
              <span className="block text-sm opacity-75">Minutes</span>
              <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded">
              <span className="block text-sm opacity-75">Seconds</span>
              <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
