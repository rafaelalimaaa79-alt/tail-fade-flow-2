
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LayoutDashboard, Briefcase, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    {
      icon: LayoutDashboard,
      text: "Dashboard",
      href: "/",
    },
    {
      icon: Briefcase,
      text: "Portfolio",
      href: "/portfolio",
    },
    {
      icon: User,
      text: "Profile",
      href: "/profile",
    },
    {
      icon: Menu,
      text: "More",
      href: "/more",
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
              path === item.href ? "text-onetime-purple" : "text-gray-500"
            )}
          />
          <span>{item.text}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
