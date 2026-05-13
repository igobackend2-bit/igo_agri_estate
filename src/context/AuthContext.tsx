import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (metadata: { name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
       const localEmail = localStorage.getItem('igo.cx.email');
       const localName = localStorage.getItem('igo.cx.name');
       const localAvatar = localStorage.getItem('igo.cx.avatar');
       setUser(localEmail ? ({ 
         id: 'local-customer', 
         email: localEmail, 
         user_metadata: { 
           name: localName || undefined,
           avatar_url: localAvatar || undefined
         } 
       } as unknown as User) : null);
       setLoading(false);

       const handleStorage = () => {
         const nextEmail = localStorage.getItem('igo.cx.email');
         const nextName = localStorage.getItem('igo.cx.name');
         const nextAvatar = localStorage.getItem('igo.cx.avatar');
         setUser(nextEmail ? ({ 
           id: 'local-customer', 
           email: nextEmail, 
           user_metadata: { 
             name: nextName || undefined,
             avatar_url: nextAvatar || undefined
           } 
         } as unknown as User) : null);
       };
      window.addEventListener('storage', handleStorage);
      window.addEventListener('igo:customer-auth', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('igo:customer-auth', handleStorage);
      };
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('igo.cx.email');
      localStorage.removeItem('igo.cx.name');
      localStorage.removeItem('igo.cx.avatar');
      window.dispatchEvent(new Event('igo:customer-auth'));
      return;
    }
    await supabase.auth.signOut();
  };

  const updateProfile = async (metadata: { name?: string; avatar_url?: string }) => {
    if (!isSupabaseConfigured) {
      if (metadata.name) localStorage.setItem('igo.cx.name', metadata.name);
      if (metadata.avatar_url) localStorage.setItem('igo.cx.avatar', metadata.avatar_url);
      window.dispatchEvent(new Event('igo:customer-auth'));
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: metadata
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, updateProfile }}>
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
