import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Session } from '@supabase/supabase-js';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('[Auth] Loading profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Auth] Error loading profile:', error);
        throw error;
      }

      console.log('[Auth] Profile loaded:', data?.email, data?.role);
      setUser(data);
    } catch (error) {
      console.error('[Auth] Failed to load user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] Initial session:', session?.user?.email);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[Auth] State change:', _event, session?.user?.email);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('[Auth] Signing in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth] Sign in error:', error);
        throw error;
      }

      console.log('[Auth] Sign in success:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('[Auth] Sign in failed:', error);
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('[Auth] Signing out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      console.log('[Auth] Sign out success');
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (email: string, newPassword: string) => {
    try {
      console.log('[Auth] Updating password for:', email);
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        console.error('[Auth] User not found:', email);
        return { error: new Error('Usuário não encontrado') };
      }

      const { error } = await supabase.auth.admin.updateUserById(
        userData.id,
        { password: newPassword }
      );

      if (error) throw error;
      console.log('[Auth] Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('[Auth] Update password error:', error);
      return { error };
    }
  }, []);

  return useMemo(() => ({
    session,
    user,
    loading,
    signIn,
    signOut,
    updatePassword,
    isAuthenticated: !!session && !!user,
    isAdmin: user?.role === 'admin',
    isBarber: user?.role === 'barber',
    isAttendant: user?.role === 'attendant',
  }), [session, user, loading, signIn, signOut, updatePassword]);
});
