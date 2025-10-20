import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "@/components/auth/SignUpForm";
import { postAuthSuccessMessage } from "@/utils/ios-bridge";
import FullscreenNotification from "@/components/FullscreenNotification";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check email verification status periodically
  useEffect(() => {
    if (!showEmailVerification) return;

    const checkEmailVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user?.email_confirmed_at) {
          console.log("Email verified! Proceeding to connect sportsbooks");
          setShowEmailVerification(false);

          // Notify iOS app of successful signup
          postAuthSuccessMessage({
            user: user,
            type: "signUp",
          });

          navigate("/connect-sportsbooks");
        }
      } catch (error) {
        console.error("Error checking email verification:", error);
      }
    };

    // Check immediately
    checkEmailVerification();

    // Then check every 3 seconds
    const interval = setInterval(checkEmailVerification, 3000);

    return () => clearInterval(interval);
  }, [showEmailVerification, navigate]);

  // Listen for email verification event from AuthContext (for when user is redirected)
  useEffect(() => {
    const handleEmailVerified = (event: any) => {
      console.log("Email verified event received in SignUp!");
      setShowEmailVerification(false);

      // Notify iOS app of successful signup
      if (event.detail?.user) {
        postAuthSuccessMessage({
          user: event.detail.user,
          type: "signUp",
        });
      }

      navigate("/connect-sportsbooks");
    };

    window.addEventListener('emailVerified', handleEmailVerified);
    return () => window.removeEventListener('emailVerified', handleEmailVerified);
  }, [navigate]);

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

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // Validate phone number has correct number of digits
    const phoneDigits = phone.replace(/[^\d]/g, "");
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("1")) {
      toast.error("Please enter a valid US phone number");
      return;
    }

    setLoading(true);

    try {
      // Try phone signup first
      // const phoneResult = await supabase.auth.signUp({
      //   phone,
      //   password,
      //   options: {
      //     data: {
      //       email: email
      //     }
      //   }
      // });

      // if (phoneResult.error) {
      //   console.log("Phone signup failed, trying email signup:", phoneResult.error);

      // Try email signup as fallback
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/connect-sportsbooks`,
          data: {
            phone: phone,
          },
        },
      });

      if (error) {
        console.log("Email signup also failed:", error);
        toast.error("Failed to create account. Please try again.");
        toast.error(`${error.message || error}`);
        return;
      }

      // Email signup succeeded
      if (data.user && !data.user.email_confirmed_at) {
        // Show fullscreen notification for email verification
        console.log("Email verification required - showing fullscreen notification");
        setUserEmail(email);
        setShowEmailVerification(true);
      } else {
        // Email already verified (shouldn't happen with new signups, but handle it)
        toast.success("Account created successfully!");

        // Notify iOS app of successful signup
        console.log("success-signUp-postAuthSuccessMessage: ", data.user);
        if (data.user) {
          postAuthSuccessMessage({
            user: data.user,
            type: "signUp",
          });
        }

        navigate("/connect-sportsbooks");
      }

      // } else {
      //   // Phone signup succeeded

      //   if (phoneResult.data.user && !phoneResult.data.user.phone_confirmed_at) {
      //     toast.success("Check your phone for a verification code!");
      //   } else {
      //     toast.success("Account created successfully!");

      //     // Notify iOS app of successful signup
      //     if (phoneResult.data.user) {
      //       postAuthSuccessMessage({
      //         user: phoneResult.data.user
      //       });
      //     }

      //     navigate('/connect-sportsbooks');
      //   }
      // }
    } catch (error: any) {
      console.error("Sign up error:", error);
      // For now, just proceed to sportsbook connection regardless of the error
      // toast.success("Proceeding to sportsbook connection - backend will handle verification");
      // navigate('/connect-sportsbooks');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/connect-sportsbooks`,
        },
      });

      if (error) throw error;

      // Note: For OAuth, the auth success message will be sent by the AuthContext
      // when the auth state changes after the redirect
    } catch (error: any) {
      console.error("Google sign up error:", error);
      toast.error("Failed to sign up with Google");
    }
  };

  return (
    <>
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
          />
        </div>
      </div>

      {/* Email Verification Fullscreen Notification */}
      <FullscreenNotification
        isOpen={showEmailVerification}
        message="VERIFY YOUR EMAIL"
        variant="email-verification"
        onClose={() => {
          // Don't allow closing until email is verified
          console.log("Email verification notification - cannot close until verified");
        }}
        bettorName={userEmail}
        betDescription="Check your inbox and click the verification link to continue"
        autoCloseAfter={0} // Don't auto-close
      />
    </>
  );
};

export default SignUp;
