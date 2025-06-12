

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onCreateAccount,
  onForgotPassword
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!showLoginForm) {
    // Welcome screen similar to Robinhood
    return (
      <div className="w-full max-w-md h-screen flex flex-col justify-center px-4 py-4 overflow-hidden fixed top-0 left-1/2 transform -translate-x-1/2">
        {/* Logo and welcome text - moved up */}
        <div className="text-center flex-1 flex flex-col justify-center items-center min-h-0 -mt-20">
          <img 
            src="/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png" 
            alt="Fade Zone logo" 
            className="h-48 mx-auto mb-6 object-contain max-w-full"
          />
          <h1 className="text-4xl font-light leading-tight">
            Welcome to<br />
            The <span className="text-onetime-red" style={{ 
              textShadow: '0 0 10px #AEE3F5, 0 0 20px #AEE3F5, 0 0 30px #AEE3F5' 
            }}>FadeZone</span>
          </h1>
        </div>
        
        {/* Buttons - moved up with less padding */}
        <div className="space-y-3 flex-shrink-0 pb-16">
          <Button 
            onClick={onCreateAccount}
            className="w-full h-12 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium rounded-md"
          >
            Sign up
          </Button>
          
          <Button 
            onClick={() => setShowLoginForm(true)}
            variant="outline"
            className="w-full h-12 text-lg border-[#AEE3F5] text-[#AEE3F5] bg-transparent hover:bg-[#AEE3F5]/10 font-medium rounded-md"
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="w-full max-w-md h-screen flex flex-col px-4 py-4 overflow-hidden fixed top-0 left-1/2 transform -translate-x-1/2">
      <div className="text-center mb-3 flex-shrink-0">
        <button 
          onClick={() => setShowLoginForm(false)}
          className="text-[#AEE3F5] mb-2 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold text-white">Sign In</h1>
        <p className="text-muted-foreground mt-1 text-xs">Welcome back to Fade Zone</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/20 bg-white/5 focus:border-primary transition-all duration-300 focus:ring-1 focus:ring-primary h-10 text-sm"
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-white/20 bg-white/5 focus:border-primary transition-all duration-300 focus:ring-1 focus:ring-primary h-10 text-sm"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-10 text-sm bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(108,92,231,0.4)] transition-all duration-300 mt-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
      
      <div className="flex flex-col items-center pt-2 text-xs flex-shrink-0 pb-safe">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-white/80 hover:text-white transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
};

export default SignInForm;

