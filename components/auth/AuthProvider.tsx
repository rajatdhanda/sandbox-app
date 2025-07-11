import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching user profile for userId:', userId);

      // Diagnostic: log current authenticated user id
      const { data: authUser } = await supabase.auth.getUser();
      const currentAuthUid = authUser?.user?.id;
      console.log('🆔 Current authenticated user id (auth.uid()):', currentAuthUid);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!userData) {
        console.warn("⚠️ No user profile found for this user.");
        setUser(null);
        setLoading(false);
        return null;
      }

      if (userError) {
        console.error('❌ Supabase query error (users table):', userError);
        throw userError;
      }

      // Diagnostic: compare fetched user id to auth.uid()
      if (userData?.id !== currentAuthUid) {
        console.warn('⚠️ Fetched user id does NOT match current auth.uid()!', { userDataId: userData?.id, currentAuthUid });
      }

      console.log('✅ User data from users table:', userData);
      setUser(userData);
    } catch (error) {
      console.error('🚨 Error fetching user profile:', error);
      console.warn('⚠️ If this error persists, check if RLS policy on "users" table allows "auth.uid() = id" and is not being tested recursively.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase Login Error:', error.message);
      throw error;
    }

    console.log('✅ Login Success, session:', data.session);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};