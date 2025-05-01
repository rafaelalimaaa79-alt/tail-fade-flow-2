
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Flame, Snowflake, BarChart2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;
  const isMobile = useIsMobile();

  const navItems = [
    {
      icon: Flame,
      text: "Hot",
      href: "/",
    },
    {
      icon: Snowflake,
      text: "Cold",
      href: "/cold",
    },
    {
      icon: BarChart2,
      text: "Portfolio",
      href: "/portfolio",
    },
    {
      icon: HelpCircle,
      text: "Help",
      href: "/help",
    },
  ];

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/70 border-t border-white/10 px-2 pb-5 pt-3">
      <div className="flex items-center justify-around mx-auto max-w-md">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="relative flex flex-col items-center"
          >
            <span 
              className={cn(
                "absolute -top-3 w-12 h-1 rounded-full transition-all duration-200",
                path === item.href 
                  ? path === "/" 
                    ? "bg-onetime-orange scale-100" 
                    : path === "/cold" 
                      ? "bg-primary scale-100" 
                      : "bg-primary scale-100"
                  : "scale-0"
              )}
            />
            <div 
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-all",
                path === item.href 
                  ? path === "/" 
                    ? "bg-onetime-orange/20 text-onetime-orange" 
                    : path === "/cold" 
                      ? "bg-primary/20 text-primary" 
                      : "bg-primary/20 text-primary"
                  : "text-white/50"
              )}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <span 
              className={cn(
                "mt-1 text-xs font-medium transition-all",
                path === item.href 
                  ? path === "/" 
                    ? "text-onetime-orange" 
                    : path === "/cold" 
                      ? "text-primary" 
                      : "text-primary"
                  : "text-white/50"
              )}
            >
              {item.text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
