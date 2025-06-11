
import React from "react";

const SignInHeader: React.FC = () => {
  return (
    <div className="text-center">
      <img 
        src="/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png" 
        alt="Fade Zone logo" 
        className="h-32 mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold text-white">Welcome Back to Fade Zone</h1>
      <p className="text-muted-foreground mt-2">Sign in to continue</p>
    </div>
  );
};

export default SignInHeader;
