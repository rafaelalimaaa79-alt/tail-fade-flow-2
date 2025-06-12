
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Snowflake, ThumbsDown, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleEnterFadeZone = () => {
    navigate('/');
  };

  const steps = [
    {
      number: "①",
      icon: <Snowflake className="w-8 h-8 text-[#AEE3F5]" />,
      title: "Cold Bettors Place Picks",
      description: "We track bettors who are ice cold — losing streaks, bad runs, you name it."
    },
    {
      number: "②", 
      icon: <ThumbsDown className="w-8 h-8 text-[#AEE3F5]" />,
      title: "You Fade Their Picks",
      description: "When they bet on something, you go the other way."
    },
    {
      number: "③",
      icon: <TrendingUp className="w-8 h-8 text-[#AEE3F5]" />,
      title: "Watch Your Portfolio Grow", 
      description: "Every fade you make gets tracked. You'll see your stats, ROI, and leaderboard rank."
    }
  ];

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light text-white mb-2">
            How <span className="text-[#AEE3F5] font-medium">FadeZone</span> Works
          </h1>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.2) }}
              className="text-center"
            >
              {/* Step Number and Icon */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-4xl font-bold text-[#AEE3F5]">
                  {step.number}
                </div>
                <div className="p-3 bg-[#AEE3F5]/20 rounded-full">
                  {step.icon}
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pb-8"
        >
          <Button
            onClick={handleEnterFadeZone}
            className="w-full h-12 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-semibold shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300"
          >
            Enter the FadeZone
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
