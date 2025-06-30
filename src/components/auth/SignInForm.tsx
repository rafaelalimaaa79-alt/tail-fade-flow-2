
import React, { useState } from "react";
import { Eye, EyeOff, Apple } from "lucide-react";
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
    // Welcome screen with logo instead of text
    return (
      <div className="w-full max-w-md h-screen flex flex-col justify-center items-center px-6 mx-auto overflow-hidden">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-light leading-tight mb-8">
            Welcome to
          </h1>
          <div className="mb-12">
            <img 
              src="/lovable-uploads/99f513eb-4898-4734-a758-01b21af1919b.png" 
              alt="NoShot logo" 
              className="h-20 mx-auto drop-shadow-[0_0_20px_rgba(174,227,245,0.5)]"
            />
          </div>
          
          <div className="space-y-4 w-full">
            <Button 
              onClick={onCreateAccount}
              className="w-full h-14 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium rounded-xl shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] transition-all duration-300"
            >
              Sign up
            </Button>
            
            <Button 
              onClick={() => setShowLoginForm(true)}
              variant="outline"
              className="w-full h-14 text-lg border-[#AEE3F5] text-[#AEE3F5] bg-transparent hover:bg-[#AEE3F5]/10 font-medium rounded-xl border-2 hover:border-[#AEE3F5]/80 transition-all duration-300"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Login form with no scrolling - tighter spacing
  return (
    <div className="w-full max-w-md h-screen flex flex-col px-6 mx-auto overflow-hidden">
      <div className="text-center mb-6 flex-shrink-0 mt-12">
        <h1 className="text-3xl font-light text-white mb-2">Sign In</h1>
        <p className="text-white/80 mb-3">Welcome back to NoShot</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base border-2 border-white/20 bg-black/50 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-2 focus:ring-[#AEE3F5]/30 rounded-xl px-4 placeholder:text-white/50 focus:shadow-[0_0_20px_rgba(174,227,245,0.2)]"
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base pr-12 border-2 border-white/20 bg-black/50 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-2 focus:ring-[#AEE3F5]/30 rounded-xl px-4 placeholder:text-white/50 focus:shadow-[0_0_20px_rgba(174,227,245,0.2)]"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-[#AEE3F5] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium rounded-xl shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] transition-all duration-300 mt-6"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Alternative sign-in options - more compact */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-white/50">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 border-white/20 hover:border-[#AEE3F5]/50 hover:bg-[#AEE3F5]/5 transition-all duration-300 text-xs"
              onClick={() => console.log("Sign in with Apple")}
            >
              <Apple className="h-4 w-4 mr-1" />
              Apple
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 border-white/20 hover:border-[#AEE3F5]/50 hover:bg-[#AEE3F5]/5 transition-all duration-300 text-xs"
              onClick={() => console.log("Sign in with Google")}
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-9 border-white/20 hover:border-[#AEE3F5]/50 hover:bg-[#AEE3F5]/5 transition-all duration-300 text-xs"
            onClick={() => console.log("Biometric login")}
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Face ID / Touch ID
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center pt-3 text-sm flex-shrink-0 pb-4 space-y-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-white/60 hover:text-[#AEE3F5] transition-colors"
        >
          Forgot your Password?
        </button>
        <button 
          onClick={() => setShowLoginForm(false)}
          className="text-[#AEE3F5] text-sm hover:text-[#AEE3F5]/80 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
