
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Award, ArrowUp, ArrowDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Icy blue glow style to match home page color
  const activeStyle = "text-[#AEE3F5] drop-shadow-[0_0_8px_rgba(174,227,245,0.7)]";

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={cn("nav-item", isActive("/") ? activeStyle : "text-white/70")}
      >
        <Home className="h-6 w-6 mb-1" />
        <span>Home</span>
      </Link>
      <Link
        to="/trends"
        className={cn("nav-item", isActive("/trends") ? activeStyle : "text-white/70")}
      >
        <div className="relative h-6 w-6 mb-1">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ArrowUp 
              className={cn(
                "h-4 w-4 -mb-1", 
                isActive("/trends") 
                  ? "text-[#AEE3F5] drop-shadow-[0_0_6px_rgba(174,227,245,0.9)]" 
                  : "text-white/70"
              )} 
            />
            <ArrowDown 
              className={cn(
                "h-4 w-4", 
                isActive("/trends") 
                  ? "text-[#AEE3F5] drop-shadow-[0_0_6px_rgba(174,227,245,0.9)]" 
                  : "text-white/70"
              )} 
            />
          </div>
        </div>
        <span>Trends</span>
      </Link>
      <Link
        to="/public"
        className={cn("nav-item", isActive("/public") ? activeStyle : "text-white/70")}
      >
        <Users className="h-6 w-6 mb-1" />
        <span>Public</span>
      </Link>
      <Link
        to="/leaders"
        className={cn("nav-item", isActive("/leaders") ? activeStyle : "text-white/70")}
      >
        <Award className="h-6 w-6 mb-1" />
        <span>Leaderboard</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
