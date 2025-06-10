
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
            src="/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png" 
            alt="Fade Zone logo" 
            className="h-24"
          />
        </div>
        <div className="flex-grow" />
      </header>

      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold">THE WATCH LIST</h1>
        <p className="text-sm text-muted-foreground">This Week's Hottest & Coldest Bettors</p>
      </div>
    </>
  );
};

export default PageHeader;
