
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Swords, Award, User, ArrowUp, ArrowDown } from "lucide-react";
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
  const competeStyle = "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]";
  const leadersStyle = "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]";
  const profileStyle = "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]";

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
        <div className="relative">
          <Sparkles className="h-6 w-6 mb-1" />
          <div className="absolute -right-4 -top-1 flex flex-col">
            <ArrowUp className="h-3 w-3 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.7)]" />
            <ArrowDown className="h-3 w-3 text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.7)]" />
          </div>
        </div>
        <span>Trends</span>
      </Link>
      <Link
        to="/compete"
        className={cn("nav-item", isActive("/compete") ? competeStyle : "text-white/70")}
      >
        <Swords className="h-6 w-6 mb-1" />
        <span>1v1</span>
      </Link>
      <Link
        to="/leaders"
        className={cn("nav-item", isActive("/leaders") ? leadersStyle : "text-white/70")}
      >
        <Award className="h-6 w-6 mb-1" />
        <span>Leaders</span>
      </Link>
      <Link
        to="/profile"
        className={cn("nav-item", isActive("/profile") ? profileStyle : "text-white/70")}
      >
        <User className="h-6 w-6 mb-1" />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
