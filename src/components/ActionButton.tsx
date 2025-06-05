
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  children: React.ReactNode;
  variant?: "fade" | "default";
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({
  children,
  variant = "default",
  className,
  onClick,
  style,
}, ref) => {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={cn(
        "h-12 w-full rounded-xl font-bold border border-white/10 text-lg",
        variant === "fade" && "bg-[#FF5C5C]/90 hover:bg-[#FF5C5C] shadow-[0_0_15px_rgba(255,92,92,0.4)]",
        variant === "default" && "bg-primary/90 hover:bg-primary shadow-[0_0_15px_rgba(108,92,231,0.4)]",
        className
      )}
      style={style}
    >
      {children}
    </Button>
  );
});

ActionButton.displayName = "ActionButton";

export default ActionButton;
