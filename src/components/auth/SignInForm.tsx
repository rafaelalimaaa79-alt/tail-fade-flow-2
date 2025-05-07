
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-24 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-white">Welcome Back to One Time</h1>
        <p className="text-muted-foreground mt-2">Sign in to continue</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/20 bg-white/5 focus:border-primary transition-all duration-300 focus:ring-1 focus:ring-primary"
            />
            <div className="absolute inset-0 rounded-md pointer-events-none border border-transparent bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 border-white/20 bg-white/5 focus:border-primary transition-all duration-300 focus:ring-1 focus:ring-primary"
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <div className="absolute inset-0 rounded-md pointer-events-none border border-transparent bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(108,92,231,0.4)] transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      
      <div className="flex flex-col items-center space-y-4 pt-4 text-sm">
        <button
          type="button"
          onClick={onCreateAccount}
          className="text-white/80 hover:text-white transition-colors"
        >
          Don't have an account? <span className="text-primary">Create one</span>
        </button>
        
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
