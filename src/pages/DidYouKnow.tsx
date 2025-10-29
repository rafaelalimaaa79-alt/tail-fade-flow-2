
import React from "react";
import { motion } from "framer-motion";

const DidYouKnow = () => {

  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
      <div className="w-full max-w-2xl text-center space-y-6">
        {/* Main Stats Content */}
        <div className="space-y-3">
          {/* 97% stat - updated with icy blue theme */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#AEE3F5]/20 to-[#AEE3F5]/10 rounded-xl blur-2xl"></div>
            <div className="relative z-10 space-y-1 py-3">
              <div className="text-5xl sm:text-6xl font-black text-[#AEE3F5] leading-none drop-shadow-[0_0_10px_rgba(174,227,245,0.4)]">
                97%
              </div>
              <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                of bettors <span className="text-[#AEE3F5] font-bold">lose</span> money year after year.
              </p>
            </div>
          </motion.div>

          {/* Call to action text - enhanced styling with smaller font */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-4 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#AEE3F5]/30 via-purple-500/20 to-[#AEE3F5]/30 rounded-2xl blur-3xl animate-pulse"></div>
            <div className="relative z-10 space-y-2 py-4 px-4">
              <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#AEE3F5] via-white to-[#AEE3F5] bg-clip-text text-transparent leading-tight drop-shadow-[0_0_4px_rgba(174,227,245,0.3)]">
                Don't be the 97%.
              </p>
              <p className="text-xl sm:text-2xl font-black text-[#AEE3F5] drop-shadow-[0_0_4px_rgba(174,227,245,0.3)]">
                Fade them.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DidYouKnow;
