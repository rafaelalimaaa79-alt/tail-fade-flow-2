
import React, { useMemo } from "react";

interface WaveTextProps {
  text: string;
  lineIndex: number;
  activeLine: number;
  animationPosition: number;
  isFade: boolean;
  waveWidth?: number;  // Configurable wave width
  maxScale?: number;   // Configurable max scale
  maxGlow?: number;    // Configurable max glow
}

const WaveText: React.FC<WaveTextProps> = ({
  text,
  lineIndex,
  activeLine,
  animationPosition,
  isFade,
  waveWidth = 0.5,  // Increased from 0.35 to 0.5 for wider wave spread
  maxScale = 0.3,
  maxGlow = 12,
}) => {
  // Memorize the words to avoid re-splitting on every render
  const words = useMemo(() => text.split(' '), [text]);
  
  // Calculate all word styles at once to improve performance
  const wordStyles = useMemo(() => {
    return words.map((word, index) => {
      // Calculate position of this word in the text (as percentage of total width)
      const wordPosition = words.length > 1 ? index / (words.length - 1) : 0;
      
      // Calculate distance from the wave position
      const distance = Math.abs(wordPosition - animationPosition);
      
      // Calculate influence factor (0 to 1) based on distance from wave center
      let influence = Math.max(0, 1 - (distance / waveWidth));
      
      // Apply a smoother curve for a more natural wave
      influence = Math.pow(influence, 1.5);
      
      // Only apply effect to current line
      if (lineIndex !== activeLine) {
        influence = 0;
      }
      
      // Scale and glow effects based on influence
      const scale = 1 + (influence * maxScale);
      const glow = Math.round(influence * maxGlow);
      const opacity = 0.7 + (influence * 0.3);
      
      const isHighlighted = influence > 0.1;
      
      // Calculate color based on type
      const baseColor = isFade ? 'var(--onetime-red)' : 'var(--onetime-green)';
      const glowColor = isFade ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)';
      
      return {
        display: 'inline-block',
        marginRight: '4px',
        transform: `scale(${scale})`,
        transition: 'all 0.05s ease-out', // Reduced from 0.2s to 0.05s for smoother animation
        color: isHighlighted ? baseColor : 'inherit',
        opacity: opacity,
        fontWeight: isHighlighted ? 'bold' : 'normal',
        textShadow: influence > 0 ? `0 0 ${glow}px ${glowColor}` : 'none',
        position: 'relative' as const,
        zIndex: Math.round(influence * 10)
      };
    });
  }, [words, lineIndex, activeLine, animationPosition, isFade, waveWidth, maxScale, maxGlow]);

  return (
    <>
      {words.map((word, index) => (
        <span key={index} className="word" style={wordStyles[index]}>
          {word}
        </span>
      ))}
    </>
  );
};

export default WaveText;
