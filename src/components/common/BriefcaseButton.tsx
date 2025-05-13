
import React from 'react';
import { Button } from "@/components/ui/button";
import { Briefcase } from 'lucide-react';

interface BriefcaseButtonProps {
  onClick?: () => void;
}

const BriefcaseButton: React.FC<BriefcaseButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative animate-glow-pulse"
      onClick={onClick}
    >
      <Briefcase className="h-5 w-5 text-onetime-purple" />
    </Button>
  );
};

export default BriefcaseButton;
