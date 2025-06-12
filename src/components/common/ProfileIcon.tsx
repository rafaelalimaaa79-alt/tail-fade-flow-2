
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
        "flex items-center justify-center w-10 h-10 rounded-full bg-[#AEE3F5]/20 border border-[#AEE3F5]/30 hover:bg-[#AEE3F5]/30 transition-all duration-300",
        "text-[#AEE3F5] hover:text-[#AEE3F5]/80 mr-6",
        className
      )}
    >
      <User className="h-6 w-6" />
    </Link>
  );
};

export default ProfileIcon;
