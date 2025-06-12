
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
      <div className="w-full max-w-2xl text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-light text-white mb-8">
            Did You Know?
          </h1>
        </motion.div>

        {/* Main Stats Content */}
        <div className="space-y-12 mb-20">
          {/* First stat - 3% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#AEE3F5]/20 to-[#AEE3F5]/10 rounded-xl blur-2xl"></div>
            <div className="relative z-10 space-y-4">
              <p className="text-2xl text-white/80 font-light">
                Only
              </p>
              <div className="text-8xl font-black text-[#AEE3F5] leading-none">
                3%
              </div>
              <p className="text-2xl text-white font-light leading-relaxed">
                of sports bettors are profitable each year.
              </p>
            </div>
          </motion.div>

          {/* Divider line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7 }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"
          />

          {/* Second stat - 97% lose */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-xl blur-2xl"></div>
            <div className="relative z-10 space-y-4">
              <p className="text-2xl text-white/80 font-light">
                The other
              </p>
              <div className="text-8xl font-black text-red-400 leading-none">
                97%
              </div>
              <p className="text-2xl text-white font-light leading-relaxed">
                lose money — yes, even the guy you buy picks from.
              </p>
            </div>
          </motion.div>

          {/* Call to action text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="pt-8"
          >
            <p className="text-3xl font-bold text-[#AEE3F5] leading-relaxed">
              Don't be the 97%.
            </p>
            <p className="text-3xl font-bold text-white mt-2">
              Fade them.
            </p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="pb-8"
        >
          <Button
            onClick={handleShowMeHow}
            className="w-full h-14 text-xl bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold shadow-[0_0_30px_rgba(174,227,245,0.5)] hover:shadow-[0_0_40px_rgba(174,227,245,0.7)] hover:scale-[1.02] transition-all duration-300"
          >
            Show Me How It Works
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DidYouKnow;
