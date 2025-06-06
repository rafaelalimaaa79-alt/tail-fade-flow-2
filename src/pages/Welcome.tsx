
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Snowflake, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartFading = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-32">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight text-gray-900">
            Welcome to Fadezone
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Profit by fading the coldest bettors on the planet.
          </p>
        </div>

        {/* 3-Step Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32">
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Track anonymous bettors</h3>
            <p className="text-gray-600 leading-relaxed">
              We monitor betting patterns across the platform
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
              <Snowflake className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Identify the coldest</h3>
            <p className="text-gray-600 leading-relaxed">
              Find bettors consistently losing the most units
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
              <ThumbsDown className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Fade their bets</h3>
            <p className="text-gray-600 leading-relaxed">
              Simple, data-driven contrarian betting
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-20">
          <p className="text-2xl font-medium text-gray-900 mb-4">No picks. No touts. Just data.</p>
          <p className="text-lg text-gray-500">Cold bettors make the market. You ride the other side.</p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleStartFading}
            className="px-12 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            Start Fading
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
