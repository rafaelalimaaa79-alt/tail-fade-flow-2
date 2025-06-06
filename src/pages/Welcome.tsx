
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 text-white overflow-hidden flex flex-col justify-center items-center px-6 py-8 relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 animate-pulse-slow"></div>
      
      {/* Main content container */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            FADEZONE
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Profit by fading the coldest bettors on the planet.
          </p>
        </div>

        {/* 3-Step Flow - Horizontal */}
        <div className="flex items-center justify-center mb-16 space-x-8">
          {/* Step 1 */}
          <div className="text-center flex-1 max-w-xs">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Track anonymous bettors</h3>
            <p className="text-sm text-white/70">
              We monitor betting patterns across the platform
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="text-white/40">
            <ArrowRight className="w-8 h-8" />
          </div>

          {/* Step 2 */}
          <div className="text-center flex-1 max-w-xs">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Snowflake className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Identify the coldest</h3>
            <p className="text-sm text-white/70">
              Find bettors consistently losing the most units
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="text-white/40">
            <ArrowRight className="w-8 h-8" />
          </div>

          {/* Step 3 */}
          <div className="text-center flex-1 max-w-xs">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <ThumbsDown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Fade their bets</h3>
            <p className="text-sm text-white/70">
              Simple, data-driven contrarian betting
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-12">
          <p className="text-2xl font-medium text-white mb-3">No picks. No touts. Just data.</p>
          <p className="text-lg text-white/60">Cold bettors make the market. You ride the other side.</p>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={handleStartFading}
          className="px-12 py-4 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
        >
          START FADING
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
