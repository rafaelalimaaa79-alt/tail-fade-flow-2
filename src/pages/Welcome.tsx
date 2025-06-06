
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Snowflake, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartFading = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated iceberg background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-tr from-teal-400/20 to-blue-400/30 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-bl from-cyan-400/25 to-blue-500/20 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Welcome to Fadezone
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Profit by fading the coldest bettors on the planet.
          </p>
        </div>

        {/* 3-Step Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-400/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">We Track Bettors</h3>
              <p className="text-gray-400 leading-relaxed">
                We monitor anonymous bettors across the app and their betting patterns
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Snowflake className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Identify Ice Cold</h3>
              <p className="text-gray-400 leading-relaxed">
                We identify who's ice cold - the bettors losing the most units consistently
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-white/10 hover:border-red-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-400/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <ThumbsDown className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">You Fade Them</h3>
              <p className="text-gray-400 leading-relaxed">
                You fade their bets. That's it. Simple, data-driven contrarian betting.
              </p>
            </div>
          </Card>
        </div>

        {/* Value Prop */}
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-2xl font-bold text-white mb-2">No picks. No touts. Just data.</p>
          <p className="text-lg text-gray-400">Cold bettors make the market. You ride the other side.</p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
          <Button
            onClick={handleStartFading}
            className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 animate-glow-pulse"
          >
            Start Fading
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
