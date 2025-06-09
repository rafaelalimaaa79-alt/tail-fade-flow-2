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
  // Use grey color for fading percentage (line 1), keep icy blue for stats (line 0)
  const textColor = lineIndex === 1 ? '#ffffff70' : '#AEE3F5'; // Grey for "89% fading", icy blue for stats
  
  return (
    <span 
      className="inline-block transition-all duration-500"
      style={{
        color: textColor,
        fontWeight: 'bold'
      }}
    >
      {text}
    </span>
  );
};

export default WaveText;
