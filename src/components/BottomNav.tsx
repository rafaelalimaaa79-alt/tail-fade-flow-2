
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Flame, Snowflake, BarChart2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

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

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn("nav-item", path === item.href && "active")}
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
          <span className={path === item.href ? "text-white" : ""}>{item.text}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
