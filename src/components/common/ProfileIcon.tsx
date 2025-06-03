
import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileIconProps {
  className?: string;
}

const ProfileIcon = ({ className }: ProfileIconProps) => {
  return (
    <Link
      to="/profile"
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full bg-pink-400/20 border border-pink-400/30 hover:bg-pink-400/30 transition-all duration-300",
        "text-pink-400 hover:text-pink-300",
        className
      )}
    >
      <User className="h-6 w-6" />
    </Link>
  );
};

export default ProfileIcon;
