
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSent(true);
      toast.success("Password reset link sent to your email");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/signin');
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
            <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="text-muted-foreground mt-2">
              {sent ? "Check your email for a reset link" : "Enter your email to receive a password reset link"}
            </p>
          </div>
          
          {!sent ? (
            <form onSubmit={handleSendResetLink} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-white/20 bg-white/5 focus:border-primary transition-all duration-300 focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(108,92,231,0.4)] transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-white">
                We've sent a password reset link to <span className="font-medium">{email}</span>. 
                Please check your email and follow the instructions.
              </p>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setSent(false)}
                className="mt-4"
              >
                Try with a different email
              </Button>
            </div>
          )}
          
          <div className="flex flex-col items-center space-y-4 pt-4 text-sm">
            <button
              type="button"
              onClick={handleBackToSignIn}
              className="text-white/80 hover:text-white transition-colors"
            >
              Back to <span className="text-primary">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
