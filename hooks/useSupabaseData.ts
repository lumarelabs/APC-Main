import { useState, useEffect, useCallback } from 'react';
import { 
  CourtsService, 
  BookingsService, 
  LessonsService,
  UsersService,
  RealtimeService 
} from '@/app/services/supabase/database';
import { useAuth } from './useAuth';

// Courts hook
export function useCourts(type?: 'padel' | 'pickleball') {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = useCallback(async () => {
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
  }, [type]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  return { courts, loading, error, refetch: fetchCourts };
}

// Lessons hook
export function useLessons() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await LessonsService.getAllLessons();
      setLessons(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, loading, error, refetch: fetchLessons };
}

// All bookings hook (for showing all users' bookings in calendar)
export function useAllBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all confirmed bookings from today onwards
      const today = new Date().toISOString().split('T')[0];
      const data = await BookingsService.getBookingsByDateRange(today, '2025-12-31');
      
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching all bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  return { bookings, loading, error, refetch: fetchAllBookings };
}

// User bookings hook with real-time updates
export function useUserBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (userId: string) => {
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
  }, []);

  useEffect(() => {
    const userId = user?.id;
    
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    fetchBookings(userId);

    // Set up real-time subscription
    const subscription = RealtimeService.subscribeToUserBookings(
      userId,
      (payload) => {
        console.log('Booking update:', payload);
        fetchBookings(userId); // Refetch on changes
      }
    );

    return () => {
      RealtimeService.unsubscribe(subscription);
    };
  }, [user?.id, fetchBookings]);

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
    refetch: () => user?.id && fetchBookings(user.id)
  };
}

// User profile hook
export function useUserProfile(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await UsersService.getUserProfile(id);
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!targetUserId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile(targetUserId);
  }, [targetUserId, fetchProfile]);

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

  const checkAvailability = useCallback(async (id: string, dateStr: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate time slots and check availability
      const timeSlots = [];
      for (let hour = 8; hour <= 22; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        const isAvailable = await BookingsService.checkCourtAvailability(
          id, 
          dateStr, 
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
  }, []);

  useEffect(() => {
    if (!courtId || !date) {
      setAvailability([]);
      setLoading(false);
      return;
    }

    checkAvailability(courtId, date);

    // Set up real-time subscription for court bookings
    const subscription = RealtimeService.subscribeToCourtBookings(
      courtId,
      () => {
        checkAvailability(courtId, date); // Refetch on changes
      }
    );

    return () => {
      RealtimeService.unsubscribe(subscription);
    };
  }, [courtId, date, checkAvailability]);

  return { availability, loading, error };
}