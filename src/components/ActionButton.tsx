
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  children: React.ReactNode;
  variant?: "fade" | "default";
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  glowEffect?: boolean; // New prop to control glow
};

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({
  children,
  variant = "default",
  className,
  onClick,
  style,
  glowEffect = false,
}, ref) => {
  const glowStyle = glowEffect ? {
    boxShadow: "0 0 20px rgba(174, 227, 245, 0.8), 0 0 40px rgba(174, 227, 245, 0.4)"
  } : {};

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={cn(
        "h-12 w-full rounded-xl font-bold border border-white/10 text-lg",
        variant === "fade" && "bg-[#AEE3F5]/90 hover:bg-[#AEE3F5] shadow-[0_0_15px_rgba(174,227,245,0.4)] text-black",
        variant === "default" && "bg-primary/90 hover:bg-primary shadow-[0_0_15px_rgba(108,92,231,0.4)]",
        className
      )}
      style={{ ...style, ...glowStyle }}
    >
      {children}
    </Button>
  );
});

ActionButton.displayName = "ActionButton";

export default ActionButton;
