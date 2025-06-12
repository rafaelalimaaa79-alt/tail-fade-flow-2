
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DidYouKnow = () => {
  const navigate = useNavigate();

  const handleShowMeHow = () => {
    navigate('/how-it-works');
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-light text-white mb-8">
            Did You Know?
          </h1>
        </motion.div>

        {/* Main Stats Content */}
        <div className="space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg blur-xl"></div>
            <p className="text-4xl font-bold text-white relative z-10 leading-tight">
              Only <span className="text-[#AEE3F5]">3–5%</span> of sports bettors are profitable each year.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-3xl text-white/90 leading-relaxed">
              <span className="text-red-400 font-semibold">95%</span> lose — chasing picks, trusting hype, and betting blind.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <p className="text-2xl font-semibold text-[#AEE3F5] leading-relaxed">
              Don't be the 95%. Fade them.
            </p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="pb-8"
        >
          <Button
            onClick={handleShowMeHow}
            className="w-full h-12 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-semibold shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300"
          >
            Show Me How It Works
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DidYouKnow;
