
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  children: React.ReactNode;
  variant?: "tail" | "fade" | "default";
  className?: string;
  onClick?: () => void;
};

const ActionButton = ({
  children,
  variant = "default",
  className,
  onClick,
}: ActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-12 w-full rounded-xl font-medium border border-white/10",
        variant === "tail" && "bg-onetime-green/90 hover:bg-onetime-green shadow-[0_0_15px_rgba(16,185,129,0.4)]",
        variant === "fade" && "bg-onetime-red/90 hover:bg-onetime-red shadow-[0_0_15px_rgba(239,68,68,0.4)]",
        variant === "default" && "bg-primary/90 hover:bg-primary shadow-[0_0_15px_rgba(108,92,231,0.4)]",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
