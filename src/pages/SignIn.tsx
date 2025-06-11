
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately redirect to the main dashboard
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12">
        <p className="text-white/70">Redirecting to home...</p>
      </div>
    </div>
  );
};

export default SignIn;
