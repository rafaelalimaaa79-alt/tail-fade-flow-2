
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
    <div className="bottom-nav fixed bottom-0 left-0 right-0 flex justify-around bg-onetime-darkBlue border-t border-white/10 py-3 px-2 z-10">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "nav-item flex flex-col items-center text-xs", 
            path === item.href && "active"
          )}
        >
          <item.icon
            className={cn(
              "mb-1 h-6 w-6",
              path === item.href 
                ? path === "/" 
                  ? "text-onetime-orange" 
                  : path === "/cold" 
                    ? "text-primary" 
                    : "text-primary"
                : "text-white/50"
            )}
          />
          <span className={path === item.href ? "text-white" : "text-white/50"}>{item.text}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
