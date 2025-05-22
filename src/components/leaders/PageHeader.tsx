
import React from "react";

interface PageHeaderProps {
  logoSrc: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ logoSrc }) => {
  return (
    <>
      <header className="mb-4 flex items-center">
        <div className="flex items-center gap-2">
          <img 
            src={logoSrc} 
            alt="ONE TIME logo" 
            className="h-24"
          />
        </div>
        <div className="flex-grow" />
      </header>

      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top performers on the platform</p>
      </div>
    </>
  );
};

export default PageHeader;
