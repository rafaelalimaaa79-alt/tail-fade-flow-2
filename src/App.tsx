
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { setupNavigationGuard } from "@/utils/navigation-guard";
import { logPlatformInfo } from "@/utils/platform-detection";
import { logIOSBridgeStatus } from "@/utils/ios-bridge";
import { useVersionCheck } from "@/hooks/useVersionCheck";

import Index from "./pages/Index";
import Trends from "./pages/Trends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Leaders from "./pages/Leaders";
import Public from "./pages/Public";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ConnectSportsbooks from "./pages/ConnectSportsbooks";
import DidYouKnow from "./pages/DidYouKnow";
import DynamicOnboarding from "./components/onboarding/DynamicOnboarding";

const queryClient = new QueryClient();

const App = () => {
  // Initialize version check (checks every 60 seconds)
  useVersionCheck(60000);

  // Initialize navigation guard and platform detection on app load
  useEffect(() => {
    console.log('🚀 Initializing app...');
    logPlatformInfo();
    logIOSBridgeStatus();
    setupNavigationGuard();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AuthProvider>
            <ChatProvider>
              <Routes>
            {/* Root route always goes to sign in - no authentication check */}
            <Route path="/" element={<SignIn />} />
            
            {/* Auth Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/onboarding" element={<DynamicOnboarding />} />
            <Route path="/did-you-know" element={<DidYouKnow />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/connect-sportsbooks" element={<ConnectSportsbooks />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/trends" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/leaders" element={<ProtectedRoute><Leaders /></ProtectedRoute>} />
            <Route path="/public" element={<ProtectedRoute><Public /></ProtectedRoute>} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
