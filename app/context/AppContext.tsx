import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useUserBookings, useUserMatches, useUserProfile } from '@/app/hooks/useSupabaseData';

type AppContextType = {
  // Auth
  user: any;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  
  // User data
  profile: any;
  bookings: any[];
  matches: any[];
  
  // Actions
  createBooking: (booking: any) => Promise<any>;
  updateBookingStatus: (bookingId: string, status: 'pending' | 'confirmed' | 'canceled') => Promise<void>;
  createMatch: (bookingId: string, players: any[]) => Promise<any>;
  updateMatchResult: (matchId: string, result: 'win' | 'loss') => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const auth = useAuth();
  const { profile, updateProfile: updateUserProfile } = useUserProfile();
  const { 
    bookings, 
    createBooking, 
    updateBookingStatus 
  } = useUserBookings();
  const { 
    matches, 
    createMatch, 
    updateMatchResult 
  } = useUserMatches();

  const updateProfile = async (updates: any) => {
    try {
      await Promise.all([
        auth.updateProfile(updates),
        updateUserProfile(updates)
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const contextValue: AppContextType = {
    // Auth
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    isAuthenticated: auth.isAuthenticated,
    
    // User data
    profile,
    bookings,
    matches,
    
    // Actions
    createBooking,
    updateBookingStatus,
    createMatch,
    updateMatchResult,
    updateProfile
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}