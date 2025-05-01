
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="onetime-container flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-onetime-purple">404</h1>
        <p className="mb-6 text-xl">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-flex items-center text-onetime-purple hover:underline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
