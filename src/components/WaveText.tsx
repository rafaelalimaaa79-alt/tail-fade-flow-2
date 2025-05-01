
import React from "react";

interface WaveTextProps {
  text: string;
  lineIndex: number;
  activeLine: number;
  animationPosition: number;
  isFade: boolean;
}

const WaveText: React.FC<WaveTextProps> = ({
  text,
  lineIndex,
  activeLine,
  animationPosition,
  isFade,
}) => {
  // Split text into words for animation
  const words = text.split(' ');

  const renderWords = () => {
    return words.map((word, index) => {
      // Calculate position of this word in the text (as percentage of total width)
      const wordPosition = index / (words.length - 1);
      
      // Calculate distance from the wave position
      // We use a continuous sine wave that moves across the text
      const distance = Math.abs(wordPosition - animationPosition);
      
      // Create a broader wave effect that affects multiple words
      const waveWidth = 0.35; // Broader effect
      
      // Calculate influence factor (0 to 1) based on distance from wave center
      // This creates a gradual falloff for the wave effect
      let influence = Math.max(0, 1 - (distance / waveWidth));
      
      // Apply a smoother curve for a more natural wave
      influence = Math.pow(influence, 1.5);
      
      // Only apply effect to current line
      if (lineIndex !== activeLine) {
        influence = 0;
      }
      
      // Scale and glow effects based on influence
      const scale = 1 + (influence * 0.3); // Max 30% larger
      const glow = Math.round(influence * 12);
      const opacity = 0.7 + (influence * 0.3); // Varies from 0.7 to 1
      
      const isHighlighted = influence > 0.1; // Affect more words
      
      // Calculate color based on type
      const baseColor = isFade ? 'var(--onetime-red)' : 'var(--onetime-green)';
      const glowColor = isFade ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)';
      
      return (
        <span 
          key={index} 
          className="word"
          style={{
            display: 'inline-block',
            marginRight: '4px',
            transform: `scale(${scale})`,
            transition: 'all 0.2s ease-out',
            color: isHighlighted ? baseColor : 'inherit',
            opacity: opacity,
            fontWeight: isHighlighted ? 'bold' : 'normal',
            textShadow: influence > 0 ? `0 0 ${glow}px ${glowColor}` : 'none',
            position: 'relative',
            zIndex: Math.round(influence * 10)
          }}
        >
          {word}
        </span>
      );
    });
  };

  return <>{renderWords()}</>;
};

export default WaveText;
