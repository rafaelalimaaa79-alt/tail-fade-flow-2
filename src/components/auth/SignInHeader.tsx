
import React from "react";

const SignInHeader: React.FC = () => {
  return (
    <div className="text-center">
      <img 
        src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
        alt="ONE TIME logo" 
        className="h-24 mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold text-white">Welcome Back to One Time</h1>
      <p className="text-muted-foreground mt-2">Sign in to continue</p>
    </div>
  );
};

export default SignInHeader;
