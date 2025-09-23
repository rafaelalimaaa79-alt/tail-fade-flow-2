
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Trends from "./pages/Trends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import BettorDetail from "./pages/BettorDetail";
import Leaders from "./pages/Leaders";
import Public from "./pages/Public";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import ForgotPassword from "./pages/ForgotPassword";
import ConnectSportsbooks from "./pages/ConnectSportsbooks";
import HowItWorks from "./pages/HowItWorks";
import DidYouKnow from "./pages/DidYouKnow";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/did-you-know" element={<DidYouKnow />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/connect-sportsbooks" element={<ConnectSportsbooks />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/trends" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/bettor/:id" element={<ProtectedRoute><BettorDetail /></ProtectedRoute>} />
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

export default App;
