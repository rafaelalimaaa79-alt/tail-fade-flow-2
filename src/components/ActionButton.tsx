
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
        "h-12 w-full rounded-xl font-medium",
        variant === "tail" && "bg-onetime-green hover:bg-onetime-green/90",
        variant === "fade" && "bg-onetime-red hover:bg-onetime-red/90",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
