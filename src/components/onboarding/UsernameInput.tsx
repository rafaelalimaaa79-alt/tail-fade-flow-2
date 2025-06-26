
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UsernameInputProps {
  username: string;
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  username,
  isChecking,
  isAvailable,
  error,
  onUsernameChange
}) => {
  const getStatusIcon = () => {
    if (isChecking) {
      return <div className="w-4 h-4 border-2 border-[#AEE3F5] border-t-transparent rounded-full animate-spin" />;
    }
    if (isAvailable === true) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (isAvailable === false) {
      return <X className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (isChecking) return "Checking...";
    if (isAvailable === true) return "✅ Available";
    if (isAvailable === false) return "❌ Taken";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-3"
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={onUsernameChange}
          className="w-full h-11 text-base bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-[#AEE3F5]/50 focus:border-[#AEE3F5]/50 shadow-[0_0_20px_rgba(174,227,245,0.1)] focus:shadow-[0_0_30px_rgba(174,227,245,0.3)] transition-all duration-300"
          maxLength={20}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>
      
      {(isAvailable !== null || isChecking) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm"
        >
          <span className={`
            ${isAvailable === true ? 'text-green-400' : 
              isAvailable === false ? 'text-red-400' : 
              'text-white/60'}
          `}>
            {getStatusText()}
          </span>
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UsernameInput;
