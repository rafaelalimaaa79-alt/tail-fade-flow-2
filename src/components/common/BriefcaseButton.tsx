
import React from 'react';
import { Button } from "@/components/ui/button";
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BriefcaseButtonProps {
  onClick?: () => void;
  className?: string; // Added className prop
}

const BriefcaseButton: React.FC<BriefcaseButtonProps> = ({ onClick, className }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative animate-glow-pulse", className)} // Use cn utility to combine classes
      onClick={onClick}
    >
      <Briefcase className="h-5 w-5 text-onetime-purple" />
    </Button>
  );
};

export default BriefcaseButton;
