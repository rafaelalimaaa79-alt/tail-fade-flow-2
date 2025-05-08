
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Swords, Award, User } from "lucide-react";
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
        to="/compete"
        className={cn("nav-item", isActive("/compete") && "active")}
      >
        <Swords className="h-6 w-6 mb-1" />
        <span>1v1</span>
      </Link>
      <Link
        to="/leaders"
        className={cn("nav-item", isActive("/leaders") && "active")}
      >
        <Award className="h-6 w-6 mb-1" />
        <span>Leaders</span>
      </Link>
      <Link
        to="/profile"
        className={cn("nav-item", isActive("/profile") && "active")}
      >
        <User className="h-6 w-6 mb-1" />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
