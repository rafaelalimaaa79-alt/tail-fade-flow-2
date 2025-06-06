
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-hidden flex flex-col justify-center items-center px-4 py-4 relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-white/50 to-blue-100/30 animate-pulse-slow"></div>
      
      {/* Main content container */}
      <div className="relative z-10 text-center max-w-sm mx-auto flex flex-col justify-center min-h-screen">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-gray-900">
            FADEZONE
          </h1>
          <p className="text-base text-gray-700 leading-relaxed font-light">
            Profit by fading the coldest bettors on the planet.
          </p>
        </div>

        {/* 3-Step Flow - Horizontal */}
        <div className="flex items-center justify-center mb-6 space-x-1">
          {/* Step 1 */}
          <div className="text-center flex-1">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 backdrop-blur-sm flex items-center justify-center border border-blue-200">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="text-gray-400 flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 2 */}
          <div className="text-center flex-1">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 backdrop-blur-sm flex items-center justify-center border border-blue-200">
              <Snowflake className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xs font-semibold mb-1 text-gray-900">Identify the coldest</h3>
            <p className="text-xs text-gray-600">
              Find bettors consistently losing the most units
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="text-gray-400 flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 3 */}
          <div className="text-center flex-1">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 backdrop-blur-sm flex items-center justify-center border border-blue-200">
              <ThumbsDown className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xs font-semibold mb-1 text-gray-900">Fade their bets</h3>
            <p className="text-xs text-gray-600">
              Simple, data-driven contrarian betting
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900 mb-2">No picks. No touts. Just data.</p>
          <p className="text-sm text-gray-600">Cold bettors make the market. You ride the other side.</p>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={handleStartFading}
          className="px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full border border-blue-600 transition-all duration-300 hover:scale-105"
        >
          START FADING
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
