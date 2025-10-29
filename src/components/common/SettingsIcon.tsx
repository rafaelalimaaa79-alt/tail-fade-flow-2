import React from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsIconProps {
  className?: string;
}

const SettingsIcon = ({ className }: SettingsIconProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/settings"
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full bg-[#AEE3F5]/20 border border-[#AEE3F5]/30 hover:bg-[#AEE3F5]/30 transition-all duration-300",
              "text-[#AEE3F5] hover:text-[#AEE3F5]/80 mr-6",
              className
            )}
          >
            <Settings className="h-6 w-6" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SettingsIcon;

