
import React from "react";

interface WaveTextProps {
  text: string;
  lineIndex: number;
  activeLine: number;
  animationPosition: number;
  isFade: boolean;
  waveWidth?: number;  // Kept for compatibility but not used
  maxScale?: number;   // Kept for compatibility but not used
  maxGlow?: number;    // Kept for compatibility but not used
}

const WaveText: React.FC<WaveTextProps> = ({
  text,
  lineIndex,
  activeLine,
  animationPosition,
  isFade,
}) => {
  // Simple pulse effect with neon icy blue color
  const isPulsing = lineIndex === activeLine;
  
  return (
    <span 
      className={`inline-block ${isPulsing ? 'animate-pulse' : ''}`}
      style={{
        color: '#AEE3F5', // Neon icy blue color
        textShadow: '0 0 5px #AEE3F5', // Much lighter glow
        fontWeight: 'bold'
      }}
    >
      {text}
    </span>
  );
};

export default WaveText;
