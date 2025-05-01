
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Flame, Snowflake, BarChart2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtBottom = window.innerHeight + currentScrollY >= document.body.scrollHeight - 10;
      
      if (isAtBottom) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 40) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      icon: Flame,
      text: "Hot",
      href: "/",
      activeColor: "#ff7e33", // Neon orange
    },
    {
      icon: Snowflake,
      text: "Cold",
      href: "/cold",
      activeColor: "#36daf7", // Neon blue
    },
    {
      customIcon: true,
      text: "Trends",
      href: "/trends",
      activeColor: "#14f195", // Neon green
    },
    {
      icon: BarChart2,
      text: "Portfolio",
      href: "/portfolio",
      activeColor: "#9b87f5", // Neon purple
    },
  ];

  if (!isMobile) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/70 border-t border-white/10 px-2 pb-3 pt-2 transition-transform duration-300",
        !isVisible ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex items-center justify-around mx-auto max-w-md">
        {navItems.map((item) => {
          const isActive = path === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="relative flex flex-col items-center"
            >
              <span 
                className={cn(
                  "absolute -top-2 w-8 h-1 rounded-full transition-all duration-200",
                  isActive 
                    ? "scale-100" 
                    : "scale-0"
                )}
                style={{ backgroundColor: isActive ? item.activeColor : 'transparent' }}
              />
              <div 
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                  isActive 
                    ? "shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
                    : ""
                )}
                style={{ 
                  backgroundColor: isActive ? `${item.activeColor}20` : 'transparent',
                  color: isActive ? item.activeColor : 'rgba(255,255,255,0.5)',
                  textShadow: isActive ? `0 0 10px ${item.activeColor}` : 'none'
                }}
              >
                {item.customIcon ? (
                  <div className="relative flex items-center justify-center">
                    <ArrowUp 
                      className="h-5 w-5 absolute -top-1.5 -right-1.5" 
                      style={{ 
                        color: '#14f195', 
                        filter: isActive ? 'drop-shadow(0 0 2px #14f195)' : 'none',
                        opacity: isActive ? 1 : 0.7
                      }} 
                    />
                    <ArrowDown 
                      className="h-5 w-5 absolute -bottom-1.5 -left-1.5" 
                      style={{ 
                        color: '#ea384c', 
                        filter: isActive ? 'drop-shadow(0 0 2px #ea384c)' : 'none',
                        opacity: isActive ? 1 : 0.7
                      }} 
                    />
                  </div>
                ) : (
                  <item.icon className="h-4 w-4" style={{ 
                    filter: isActive ? 'drop-shadow(0 0 2px currentColor)' : 'none'
                  }} />
                )}
              </div>
              <span 
                className={cn(
                  "mt-0.5 text-[10px] font-medium transition-all",
                  isActive ? "text-white" : "text-white/50"
                )}
                style={{ 
                  color: isActive ? item.activeColor : 'rgba(255,255,255,0.5)'
                }}
              >
                {item.text}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
