
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
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden flex flex-col justify-between px-6 py-8">
      {/* Hero Section - Compact */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-gray-900">
          Welcome to Fadezone
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
          Profit by fading the coldest bettors on the planet.
        </p>
      </div>

      {/* 3-Step Explanation - Horizontal Flow */}
      <div className="flex items-center justify-center max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="text-center flex-1 max-w-xs">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold mb-2 text-gray-900">Track anonymous bettors</h3>
          <p className="text-sm text-gray-600">
            We monitor betting patterns across the platform
          </p>
        </div>

        {/* Arrow 1 */}
        <div className="mx-4 text-gray-400">
          <ArrowRight className="w-6 h-6" />
        </div>

        {/* Step 2 */}
        <div className="text-center flex-1 max-w-xs">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
            <Snowflake className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold mb-2 text-gray-900">Identify the coldest</h3>
          <p className="text-sm text-gray-600">
            Find bettors consistently losing the most units
          </p>
        </div>

        {/* Arrow 2 */}
        <div className="mx-4 text-gray-400">
          <ArrowRight className="w-6 h-6" />
        </div>

        {/* Step 3 */}
        <div className="text-center flex-1 max-w-xs">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
            <ThumbsDown className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold mb-2 text-gray-900">Fade their bets</h3>
          <p className="text-sm text-gray-600">
            Simple, data-driven contrarian betting
          </p>
        </div>
      </div>

      {/* Value Proposition & CTA - Compact */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">No picks. No touts. Just data.</p>
        <p className="text-sm text-gray-500 mb-6">Cold bettors make the market. You ride the other side.</p>
        
        <Button
          onClick={handleStartFading}
          className="px-8 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          Start Fading
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
