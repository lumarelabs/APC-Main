import { useState, useEffect } from 'react';
import { 
  CourtsService, 
  BookingsService, 
  MatchesService, 
  UsersService,
  RealtimeService 
} from '@/app/services/supabase/database';
import { useAuth } from './useAuth';

// Courts hook
export function useCourts(type?: 'padel' | 'pickleball') {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = type 
          ? await CourtsService.getCourtsByType(type)
          : await CourtsService.getAllCourts();
        
        setCourts(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching courts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [type]);

  return { courts, loading, error, refetch: fetchCourts };
}

// User bookings hook with real-time updates
export function useUserBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await BookingsService.getUserBookings(userId);
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Set up real-time subscription
    const subscription = RealtimeService.subscribeToUserBookings(
      userId,
      (payload) => {
        console.log('Booking update:', payload);
        fetchBookings(); // Refetch on changes
      }
    );

    return () => {
      RealtimeService.unsubscribe(subscription);
    };
  }, [user?.id]); // Only depend on user.id, not the entire user object

  const createBooking = async (bookingData: any) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newBooking = await BookingsService.createBooking({
        ...bookingData,
        user_id: user.id
      });
      
      // Optimistically update local state
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'canceled') => {
    try {
      await BookingsService.updateBookingStatus(bookingId, status);
      
      // Optimistically update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status }
            : booking
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    bookings, 
    loading, 
    error, 
    createBooking, 
    updateBookingStatus,
    refetch: fetchBookings
  };
}

// User matches hook
export function useUserMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    
    if (!userId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await MatchesService.getUserMatches(userId);
        setMatches(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user?.id]); // Only depend on user.id, not the entire user object

  const createMatch = async (bookingId: string, players: any[]) => {
    try {
      const newMatch = await MatchesService.createMatch(bookingId, players);
      setMatches(prev => [...prev, newMatch]);
      return newMatch;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateMatchResult = async (matchId: string, result: 'win' | 'loss') => {
    try {
      await MatchesService.updateMatchResult(matchId, result);
      
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? { ...match, result, status: 'completed' }
            : match
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    matches, 
    loading, 
    error, 
    createMatch, 
    updateMatchResult 
  };
}

// User profile hook
export function useUserProfile(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUserId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await UsersService.getUserProfile(targetUserId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  const updateProfile = async (updates: any) => {
    try {
      if (!targetUserId) throw new Error('No user ID');
      
      await UsersService.updateUserProfile(targetUserId, updates);
      setProfile((prev: any) => ({ ...prev, ...updates }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    profile, 
    loading, 
    error, 
    updateProfile 
  };
}

// Court availability hook
export function useCourtAvailability(courtId: string, date: string) {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courtId || !date) {
      setAvailability([]);
      setLoading(false);
      return;
    }

    const checkAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Generate time slots and check availability
        const timeSlots = [];
        for (let hour = 8; hour <= 22; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`;
          const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
          
          const isAvailable = await BookingsService.checkCourtAvailability(
            courtId, 
            date, 
            startTime, 
            endTime
          );
          
          timeSlots.push({
            startTime,
            endTime,
            available: isAvailable
          });
        }
        
        setAvailability(timeSlots);
      } catch (err: any) {
        setError(err.message);
        console.error('Error checking availability:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();

    // Set up real-time subscription for court bookings
    const subscription = RealtimeService.subscribeToCourtBookings(
      courtId,
      () => {
        checkAvailability(); // Refetch on changes
      }
    );

    return () => {
      RealtimeService.unsubscribe(subscription);
    };
  }, [courtId, date]);

  return { availability, loading, error };
}