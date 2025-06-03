
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Award, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
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

  // Neon glow styles for each icon
  const homeStyle = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]";
  const trendsStyle = "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]";
  const leadersStyle = "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]";
  const publicStyle = "text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]";

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={cn("nav-item", isActive("/") ? homeStyle : "text-white/70")}
      >
        <Home className="h-6 w-6 mb-1" />
        <span>Home</span>
      </Link>
      <Link
        to="/trends"
        className={cn("nav-item", isActive("/trends") ? trendsStyle : "text-white/70")}
      >
        <div className="relative h-6 w-6 mb-1">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ArrowUp 
              className={cn(
                "h-4 w-4 -mb-1", 
                isActive("/trends") 
                  ? "text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.9)]" 
                  : "text-white/70"
              )} 
            />
            <ArrowDown 
              className={cn(
                "h-4 w-4", 
                isActive("/trends") 
                  ? "text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.9)]" 
                  : "text-white/70"
              )} 
            />
          </div>
        </div>
        <span>Trends</span>
      </Link>
      <Link
        to="/public"
        className={cn("nav-item", isActive("/public") ? publicStyle : "text-white/70")}
      >
        <TrendingUp className="h-6 w-6 mb-1" />
        <span>Public</span>
      </Link>
      <Link
        to="/leaders"
        className={cn("nav-item", isActive("/leaders") ? leadersStyle : "text-white/70")}
      >
        <Award className="h-6 w-6 mb-1" />
        <span>Streakers</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
