import { useState, useEffect } from 'react';
import { authService, type AuthState } from '@/app/services/supabase/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      await authService.signUp(email, password, fullName);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: { full_name?: string; level?: string; profile_image_url?: string }) => {
    try {
      await authService.updateProfile(updates);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const clearError = () => {
    authService.clearError();
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    clearError,
    isAuthenticated: !!authState.user
  };
}