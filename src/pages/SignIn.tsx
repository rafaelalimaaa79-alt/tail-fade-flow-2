
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [navigate]);

  // Check if the device supports biometrics
  const supportsBiometrics = 'FaceID' in window || 'TouchID' in window || 'webauthn' in navigator;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if this is the user's first time logging in (no biometric preference set)
      const biometricEnabled = localStorage.getItem('biometricEnabled');
      
      if (!biometricEnabled && supportsBiometrics) {
        setShowBiometricPrompt(true);
      } else {
        toast.success("Signed in successfully");
        navigate('/');
      }
      
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  const handleEnableBiometrics = () => {
    // Store biometric preference
    localStorage.setItem('biometricEnabled', 'true');
    toast.success("Biometric authentication enabled");
    setShowBiometricPrompt(false);
    navigate('/');
  };
  
  const handleSkipBiometrics = () => {
    localStorage.setItem('biometricEnabled', 'false');
    setShowBiometricPrompt(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12">
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
          
          <form onSubmit={handleSignIn} className="space-y-6">
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
              onClick={handleCreateAccount}
              className="text-white/80 hover:text-white transition-colors"
            >
              Don't have an account? <span className="text-primary">Create one</span>
            </button>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-white/80 hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
      
      {/* Biometric Prompt Dialog */}
      <Dialog open={showBiometricPrompt} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-background border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-center">Enable Biometric Login</DialogTitle>
            <DialogDescription className="text-center">
              Want to sign in with {('FaceID' in window) ? 'Face ID' : 'Fingerprint'} next time?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            <Fingerprint className="h-20 w-20 text-primary animate-pulse-heartbeat" />
          </div>
          
          <DialogFooter className="flex flex-row justify-center gap-4 sm:justify-center">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSkipBiometrics}
            >
              Not Now
            </Button>
            <Button 
              type="button"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleEnableBiometrics}
            >
              Yes, Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignIn;
