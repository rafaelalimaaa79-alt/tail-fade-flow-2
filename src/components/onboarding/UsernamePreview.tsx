
import React from "react";
import { motion } from "framer-motion";

interface UsernamePreviewProps {
  username: string;
  isAvailable: boolean | null;
}

const UsernamePreview: React.FC<UsernamePreviewProps> = ({ username, isAvailable }) => {
  if (!username || !isAvailable) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="p-3 bg-white/5 border border-white/10 rounded-lg"
    >
      <p className="text-white/50 text-xs mb-1">Preview:</p>
      <p className="text-white text-sm">
        <span className="text-[#AEE3F5]">@{username}</span> just faded ColdHands88
      </p>
    </motion.div>
  );
};

export default UsernamePreview;
