
import React from "react";
import { Bell } from "lucide-react";

const PageHeader: React.FC = () => {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-20"
          />
        </div>
        <button className="rounded-full p-2 text-white/80 hover:text-white">
          <Bell className="h-6 w-6" />
        </button>
      </header>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Compete</h1>
        <p className="text-sm text-muted-foreground mt-1">Challenge others and win big</p>
      </div>
    </>
  );
};

export default PageHeader;
