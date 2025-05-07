
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  biometricEnabled: boolean;
  setBiometricEnabled: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(() => {
    const stored = localStorage.getItem('biometricEnabled');
    return stored === 'true';
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Store biometric preference when it changes
    localStorage.setItem('biometricEnabled', biometricEnabled.toString());
  }, [biometricEnabled]);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          // Clear any local state that should be reset on sign out
          setBiometricEnabled(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate('/signin');
    } catch (error) {
      toast.error('Error signing out');
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signOut,
        biometricEnabled,
        setBiometricEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
