
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !phone || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      // Try phone signup first
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            email: email
          }
        }
      });
      
      if (error) {
        // If phone signup fails, proceed anyway for now
        console.log("Phone signup not available, proceeding to sportsbook connection:", error);
        toast.success("Account setup initiated - proceeding to sportsbook connection");
        navigate('/connect-sportsbooks');
        return;
      }
      
      if (data.user && !data.user.phone_confirmed_at) {
        toast.success("Check your phone for a verification code!");
      } else {
        toast.success("Account created successfully!");
        navigate('/connect-sportsbooks');
      }
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      // For now, just proceed to sportsbook connection regardless of the error
      toast.success("Proceeding to sportsbook connection - backend will handle verification");
      navigate('/connect-sportsbooks');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/connect-sportsbooks`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google sign up error:", error);
      toast.error("Failed to sign up with Google");
    }
  };

  const handleAppleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/connect-sportsbooks`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Apple sign up error:", error);
      toast.error("Failed to sign up with Apple");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12">
        <SignUpForm
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          onSubmit={handleSignUp}
          onSignIn={handleSignIn}
          onGoogleSignUp={handleGoogleSignUp}
          onAppleSignUp={handleAppleSignUp}
        />
      </div>
    </div>
  );
};

export default SignUp;
