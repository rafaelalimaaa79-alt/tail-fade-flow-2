
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

  const DigitalNumber = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-[#AEE3F5] text-4xl font-bold tracking-wider digital-display seven-segment-font">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[#AEE3F5]/80 text-xs font-mono mt-1 tracking-wider">
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <div className="text-[#AEE3F5] text-4xl font-bold px-2 seven-segment-font">
      :
    </div>
  );

  return (
    <div className="bg-background p-6 rounded-lg mb-6 border border-[#AEE3F5]/30">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Clock className="h-6 w-6 text-[#AEE3F5]" />
        <h2 className="text-xl font-bold text-[#AEE3F5]/80">Next Top 10 Reveal</h2>
      </div>
      
      <div className="flex items-center justify-center space-x-1">
        <DigitalNumber value={timeLeft.hours} label="HR" />
        <Separator />
        <DigitalNumber value={timeLeft.minutes} label="MIN" />
        <Separator />
        <DigitalNumber value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  );
};

export default CountdownTimer;
