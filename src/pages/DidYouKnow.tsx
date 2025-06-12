
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
    <div className="bg-black min-h-screen flex flex-col justify-center items-center px-4 py-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Did You Know?
          </h1>
        </motion.div>

        {/* Main Stats Content */}
        <div className="space-y-4">
          {/* First stat - 3% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#AEE3F5]/20 to-[#AEE3F5]/10 rounded-xl blur-2xl"></div>
            <div className="relative z-10 space-y-2 py-4">
              <div className="text-7xl font-black text-[#AEE3F5] leading-none drop-shadow-[0_0_10px_rgba(174,227,245,0.4)]">
                3%
              </div>
              <p className="text-xl text-white font-medium leading-relaxed">
                of sports bettors are profitable each year.
              </p>
            </div>
          </motion.div>

          {/* Second stat - 97% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-xl blur-2xl"></div>
            <div className="relative z-10 space-y-2 py-4">
              <div className="text-7xl font-black text-red-400 leading-none drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]">
                97%
              </div>
              <p className="text-xl text-white font-medium leading-relaxed">
                lose money — yes, <span className="text-white font-bold">even the guy you buy picks from.</span>
              </p>
            </div>
          </motion.div>

          {/* Call to action text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="pt-2"
          >
            <p className="text-2xl font-black text-white leading-relaxed">
              Don't be the 97%.
            </p>
            <p className="text-2xl font-black text-white mt-1">
              Fade them.
            </p>
          </motion.div>
        </div>

        {/* CTA Button - moved closer to content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="w-full max-w-2xl pt-4"
        >
          <Button
            onClick={handleShowMeHow}
            className="w-full h-12 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold shadow-[0_0_20px_rgba(174,227,245,0.3)] hover:shadow-[0_0_25px_rgba(174,227,245,0.4)] hover:scale-[1.02] transition-all duration-300"
          >
            Show Me How It Works
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DidYouKnow;
