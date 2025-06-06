
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Snowflake, ThumbsDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartFading = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 text-white overflow-hidden flex flex-col justify-center items-center px-4 py-4 relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 animate-pulse-slow"></div>
      
      {/* Main content container */}
      <div className="relative z-10 text-center max-w-sm mx-auto flex flex-col justify-center min-h-screen">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">
            FADEZONE
          </h1>
          <p className="text-base text-white/80 leading-relaxed font-light">
            Profit by fading the coldest bettors on the planet.
          </p>
        </div>

        {/* 3-Step Flow - Horizontal */}
        <div className="flex items-center justify-center mb-6 space-x-1">
          {/* Step 1 */}
          <div className="text-center flex-1">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="text-white/40 flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 2 */}
          <div className="text-center flex-1">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Snowflake className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xs font-semibold mb-1 text-white">Identify the coldest</h3>
            <p className="text-xs text-white/70">
              Find bettors consistently losing the most units
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="text-white/40 flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 3 */}
          <div className="text-center flex-1">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <ThumbsDown className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xs font-semibold mb-1 text-white">Fade their bets</h3>
            <p className="text-xs text-white/70">
              Simple, data-driven contrarian betting
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-6">
          <p className="text-lg font-medium text-white mb-2">No picks. No touts. Just data.</p>
          <p className="text-sm text-white/60">Cold bettors make the market. You ride the other side.</p>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={handleStartFading}
          className="px-6 py-3 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
        >
          START FADING
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
