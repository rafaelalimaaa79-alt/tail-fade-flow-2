
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle } from "lucide-react";
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
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
    <div className="w-full max-w-md h-screen flex flex-col px-6 py-4 overflow-hidden fixed top-0 left-1/2 transform -translate-x-1/2 animate-fade-in">
      {!sent ? (
        <>
          {/* Header Section */}
          <div className="text-center mb-12 flex-shrink-0 pt-16">
            <div className="w-16 h-16 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#AEE3F5]" />
            </div>
            <h1 className="text-3xl font-light text-white mb-3">Reset Your Password</h1>
            <p className="text-white/80 text-base leading-relaxed">
              Drop your email and we'll send you a reset link.
            </p>
          </div>
          
          {/* Form Section */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
            <form onSubmit={handleSendResetLink} className="space-y-8">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-base border-2 border-white/20 bg-black/50 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-2 focus:ring-[#AEE3F5]/30 rounded-xl px-4 placeholder:text-white/50 focus:shadow-[0_0_20px_rgba(174,227,245,0.2)]"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 text-lg bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium rounded-xl shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </div>
          
          {/* Footer Section */}
          <div className="flex flex-col items-center pt-8 text-sm flex-shrink-0 pb-16">
            <button
              type="button"
              onClick={handleBackToSignIn}
              className="text-white/60 hover:text-[#AEE3F5] transition-colors hover:shadow-[0_0_10px_rgba(174,227,245,0.3)] px-2 py-1 rounded"
            >
              Back to <span className="text-[#AEE3F5]">Sign In</span>
            </button>
          </div>
        </>
      ) : (
        /* Success State */
        <div className="flex-1 flex flex-col justify-center items-center text-center animate-fade-in">
          <div className="w-20 h-20 bg-[#AEE3F5]/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-pop">
            <CheckCircle className="w-10 h-10 text-[#AEE3F5]" />
          </div>
          
          <h1 className="text-3xl font-light text-white mb-4">Link Sent!</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-white/80 text-base leading-relaxed">
              We've sent a password reset link to<br />
              <span className="font-medium text-[#AEE3F5]">{email}</span>
            </p>
            <p className="text-white/60 text-sm">
              Check your email and follow the instructions.
            </p>
          </div>
          
          <div className="space-y-4 w-full">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setSent(false)}
              className="w-full h-12 border-2 border-white/20 hover:border-[#AEE3F5]/50 hover:bg-[#AEE3F5]/5 text-white transition-all duration-300 rounded-xl"
            >
              Try with a different email
            </Button>
            
            <button
              type="button"
              onClick={handleBackToSignIn}
              className="text-white/60 hover:text-[#AEE3F5] transition-colors hover:shadow-[0_0_10px_rgba(174,227,245,0.3)] px-2 py-1 rounded block mx-auto"
            >
              Back to <span className="text-[#AEE3F5]">Sign In</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
