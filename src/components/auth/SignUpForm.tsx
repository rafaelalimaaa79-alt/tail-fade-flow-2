import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSignIn: () => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  onSubmit,
  onSignIn,
  onGoogleSignUp,
  onAppleSignUp
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters except +
    const phoneNumber = value.replace(/[^\d+]/g, '');
    
    // If it starts with +1, format as +1 (XXX) XXX-XXXX
    if (phoneNumber.startsWith('+1')) {
      const digits = phoneNumber.slice(2);
      if (digits.length <= 3) {
        return `+1 ${digits}`;
      } else if (digits.length <= 6) {
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }
    // If it starts with +, keep as is
    else if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    // If no country code, assume US and format as +1 (XXX) XXX-XXXX
    else {
      if (phoneNumber.length <= 3) {
        return phoneNumber ? `+1 ${phoneNumber}` : '';
      } else if (phoneNumber.length <= 6) {
        return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If user is typing + at the beginning, allow it
    if (value === '+') {
      setPhone(value);
      return;
    }
    
    const formattedPhone = formatPhoneNumber(value);
    setPhone(formattedPhone);
  };

  return (
    <div className="w-full max-w-md h-screen flex flex-col px-4 py-8 overflow-hidden fixed top-0 left-1/2 transform -translate-x-1/2">
      {/* Header */}
      <div className="text-center mb-8 flex-shrink-0">
        <h1 className="text-4xl sm:text-5xl font-light leading-tight mb-3">
          Create Your <span className="text-[#AEE3F5]" style={{ 
            textShadow: '0 0 10px #AEE3F5, 0 0 20px #AEE3F5, 0 0 30px #AEE3F5' 
          }}>Account</span>
        </h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Track fades, follow cold bettors, and build your edge.
        </p>
      </div>
      
      {/* Form */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Alternative Sign-Up Options */}
          <div className="space-y-3 mb-6">
            {onGoogleSignUp && (
              <Button 
                type="button"
                onClick={onGoogleSignUp}
                variant="outline"
                className="w-full h-12 text-sm border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            )}
            
            {onAppleSignUp && (
              <Button 
                type="button"
                onClick={onAppleSignUp}
                variant="outline"
                className="w-full h-12 text-sm border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button>
            )}
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-white/50">Or</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/20 bg-white/5 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-1 focus:ring-[#AEE3F5] focus:shadow-[0_0_10px_rgba(174,227,245,0.3)] h-12 text-sm"
              />
            </div>
            
            <div className="relative">
              <Input
                type="tel"
                placeholder="Phone Number (+1 (555) 123-4567)"
                value={phone}
                onChange={handlePhoneChange}
                className="border-white/20 bg-white/5 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-1 focus:ring-[#AEE3F5] focus:shadow-[0_0_10px_rgba(174,227,245,0.3)] h-12 text-sm"
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-white/20 bg-white/5 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-1 focus:ring-[#AEE3F5] focus:shadow-[0_0_10px_rgba(174,227,245,0.3)] h-12 text-sm"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10 border-white/20 bg-white/5 focus:border-[#AEE3F5] transition-all duration-300 focus:ring-1 focus:ring-[#AEE3F5] focus:shadow-[0_0_10px_rgba(174,227,245,0.3)] h-12 text-sm"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-sm bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-medium shadow-[0_0_15px_rgba(174,227,245,0.4)] hover:shadow-[0_0_25px_rgba(174,227,245,0.6)] transition-all duration-300 mt-6"
            disabled={loading}
          >
            {loading ? "Getting Started..." : "Get Started"}
          </Button>
        </form>
      </div>
      
      {/* Login Redirect */}
      <div className="flex justify-center pt-6 text-sm flex-shrink-0 pb-safe">
        <span className="text-white/70">Already have an account? </span>
        <button
          type="button"
          onClick={onSignIn}
          className="ml-1 text-[#AEE3F5] hover:text-[#AEE3F5]/80 transition-colors relative group"
        >
          Log in
          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#AEE3F5] group-hover:w-full transition-all duration-300 shadow-[0_0_5px_rgba(174,227,245,0.5)]"></span>
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
