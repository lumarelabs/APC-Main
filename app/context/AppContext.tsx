import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

type User = {
  id: string;
  name: string;
  email: string;
  level: string;
  profileImage: string;
  skillLevel: 'Başlangıç' | 'Orta' | 'İleri';
};

type Booking = {
  id: string;
  courtName: string;
  courtType: 'padel' | 'pickleball';
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'confirmed' | 'canceled';
};

type Match = {
  id: string;
  courtName: string;
  courtType: 'padel' | 'pickleball';
  date: string;
  time: string;
  opponents: string[];
  partners: string[];
  status: 'pending' | 'confirmed' | 'completed';
  result?: 'win' | 'loss';
};

type AppContextType = {
  user: User | null;
  bookings: Booking[];
  matches: Match[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    level: '3.5',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    skillLevel: 'Orta',
  });
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      courtName: 'Downtown Padel Club',
      courtType: 'padel',
      date: 'Today',
      time: '18:00 - 19:30',
      price: 35,
      status: 'confirmed',
    },
    {
      id: '2',
      courtName: 'Riverside Pickleball',
      courtType: 'pickleball',
      date: 'Tomorrow',
      time: '10:00 - 11:30',
      price: 25,
      status: 'confirmed',
    },
  ]);
  
  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      courtName: 'Downtown Padel Club',
      courtType: 'padel',
      date: 'Today',
      time: '18:00 - 19:30',
      opponents: ['Sarah K.', 'Michael T.'],
      partners: ['You', 'James R.'],
      status: 'confirmed',
    },
    {
      id: '2',
      courtName: 'Riverside Pickleball',
      courtType: 'pickleball',
      date: 'Tomorrow',
      time: '10:00 - 11:30',
      opponents: ['Emma D.'],
      partners: ['You'],
      status: 'confirmed',
    },
    {
      id: '3',
      courtName: 'Beach Pickleball Courts',
      courtType: 'pickleball',
      date: 'Mon, 14 Oct',
      time: '16:00 - 17:30',
      opponents: ['David S.', 'Jennifer M.'],
      partners: ['You', 'Lisa K.'],
      status: 'completed',
      result: 'win',
    },
    {
      id: '4',
      courtName: 'Downtown Padel Club',
      courtType: 'padel',
      date: 'Sat, 5 Oct',
      time: '10:00 - 11:30',
      opponents: ['John D.', 'Karen W.'],
      partners: ['You', 'Mark R.'],
      status: 'completed',
      result: 'loss',
    },
  ]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    try {
      // In a real app, this would be an API call to authenticate
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email: email,
        level: '3.5',
        profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        skillLevel: 'Orta',
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const createBooking = async (booking: Omit<Booking, 'id'>) => {
    // Simulate API call
    try {
      // In a real app, this would be an API call to create a booking
      const newBooking: Booking = {
        ...booking,
        id: `booking-${Date.now()}`,
      };
      
      setBookings([...bookings, newBooking]);
    } catch (error) {
      console.error('Create booking failed:', error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    // Simulate API call
    try {
      // In a real app, this would be an API call to cancel a booking
      setBookings(
        bookings.map((booking) => 
          booking.id === bookingId 
            ? { ...booking, status: 'canceled' } 
            : booking
        )
      );
    } catch (error) {
      console.error('Cancel booking failed:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        bookings,
        matches,
        login,
        logout,
        createBooking,
        cancelBooking,
      }}
    >
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