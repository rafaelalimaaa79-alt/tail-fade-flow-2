
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Flame, Award, User } from "lucide-react";
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

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={cn("nav-item", isActive("/") && "active")}
      >
        <Home className="h-6 w-6 mb-1" />
        <span>Home</span>
      </Link>
      <Link
        to="/trends"
        className={cn("nav-item", isActive("/trends") && "active")}
      >
        <Sparkles className="h-6 w-6 mb-1" />
        <span>Trends</span>
      </Link>
      <Link
        to="/cold"
        className={cn("nav-item", isActive("/cold") && "active")}
      >
        <Flame className="h-6 w-6 mb-1" />
        <span>Cold</span>
      </Link>
      <Link
        to="/leaders"
        className={cn("nav-item", isActive("/leaders") && "active")}
      >
        <Award className="h-6 w-6 mb-1" />
        <span>Leaders</span>
      </Link>
      <div className="nav-item relative group">
        <div className="cursor-pointer flex flex-col items-center">
          <User className={cn("h-6 w-6 mb-1", isActive("/profile") && "text-primary")} />
          <span className={cn(isActive("/profile") && "text-primary")}>Profile</span>
        </div>
        
        {/* Dropdown Menu */}
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-32 bg-black border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <Link
            to="/profile"
            className="block w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-t-lg"
          >
            My Profile
          </Link>
          <Link
            to="/compete"
            className="block w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
          >
            Compete
          </Link>
          <button
            onClick={signOut}
            className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-b-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
