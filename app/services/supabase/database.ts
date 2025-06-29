import { supabase } from './config';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type Court = Tables['courts']['Row'];
type Booking = Tables['bookings']['Row'];
type UserProfile = Tables['users']['Row'];
type Lesson = Tables['lessons']['Row'];

// Error handling wrapper
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database error in ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Courts Service
export class CourtsService {
  static async getAllCourts(): Promise<Court[]> {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('name');

      if (error) {
        handleDatabaseError(error, 'fetch courts');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch courts');
      return [];
    }
  }

  static async getCourtsByType(type: 'padel' | 'pickleball'): Promise<Court[]> {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('type', type)
        .order('name');

      if (error) {
        handleDatabaseError(error, 'fetch courts by type');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch courts by type');
      return [];
    }
  }

  static async getCourtById(id: string): Promise<Court | null> {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        handleDatabaseError(error, 'fetch court by id');
      }

      return data || null;
    } catch (error) {
      handleDatabaseError(error, 'fetch court by id');
      return null;
    }
  }
}

// Lessons Service
export class LessonsService {
  static async getAllLessons(): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('type', { ascending: true });

      if (error) {
        handleDatabaseError(error, 'fetch lessons');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch lessons');
      return [];
    }
  }

  static async getLessonById(id: string): Promise<Lesson | null> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        handleDatabaseError(error, 'fetch lesson by id');
      }

      return data || null;
    } catch (error) {
      handleDatabaseError(error, 'fetch lesson by id');
      return null;
    }
  }
}

// Bookings Service
export class BookingsService {
  static async getUserBookings(userId: string): Promise<(Booking & { court: Court; lesson?: Lesson })[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(*),
          lesson:lessons(*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        handleDatabaseError(error, 'fetch user bookings');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch user bookings');
      return [];
    }
  }

  static async createBooking(booking: Tables['bookings']['Insert']): Promise<Booking> {
    try {
      // CRITICAL: Check for booking conflicts before creating
      const hasConflict = await this.checkCourtAvailability(
        booking.court_id,
        booking.date,
        booking.start_time,
        booking.end_time
      );

      if (!hasConflict) {
        throw new Error('Bu kort ve saat için zaten bir rezervasyon bulunmaktadır. Lütfen farklı bir saat seçin.');
      }

      // Calculate lighting fee if booking is after 20:30
      const startTime = booking.start_time;
      const [hours, minutes] = startTime.split(':').map(Number);
      const isNightBooking = hours > 20 || (hours === 20 && minutes >= 30);
      
      const bookingData = {
        ...booking,
        includes_lighting: isNightBooking,
        status: 'confirmed' as const // Directly confirm the booking
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        // Handle specific conflict errors
        if (error.message?.includes('unique_confirmed_bookings') || 
            error.message?.includes('zaten onaylanmış bir rezervasyon')) {
          throw new Error('Bu kort ve saat için zaten bir rezervasyon bulunmaktadır. Lütfen farklı bir saat seçin.');
        }
        handleDatabaseError(error, 'create booking');
      }

      return data;
    } catch (error: any) {
      // Re-throw our custom error messages
      if (error.message?.includes('zaten bir rezervasyon') || 
          error.message?.includes('farklı bir saat')) {
        throw error;
      }
      handleDatabaseError(error, 'create booking');
      throw error;
    }
  }

  static async updateBookingStatus(
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'canceled'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) {
        // Handle specific conflict errors when confirming
        if (status === 'confirmed' && 
            (error.message?.includes('unique_confirmed_bookings') || 
             error.message?.includes('zaten onaylanmış bir rezervasyon'))) {
          throw new Error('Bu kort ve saat için zaten onaylanmış bir rezervasyon bulunmaktadır.');
        }
        handleDatabaseError(error, 'update booking status');
      }
    } catch (error: any) {
      // Re-throw our custom error messages
      if (error.message?.includes('zaten onaylanmış bir rezervasyon')) {
        throw error;
      }
      handleDatabaseError(error, 'update booking status');
    }
  }

  static async getBookingsByDateRange(
    startDate: string, 
    endDate: string
  ): Promise<(Booking & { court: Court; lesson?: Lesson })[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(*),
          lesson:lessons(*)
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('status', 'confirmed')
        .order('date')
        .order('start_time');

      if (error) {
        handleDatabaseError(error, 'fetch bookings by date range');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch bookings by date range');
      return [];
    }
  }

  static async checkCourtAvailability(
    courtId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      // Use the database function for accurate conflict checking
      const { data, error } = await supabase
        .rpc('check_booking_conflict', {
          p_court_id: courtId,
          p_date: date,
          p_start_time: startTime,
          p_end_time: endTime
        });

      if (error) {
        console.error('Error checking court availability:', error);
        // If function fails, fall back to manual check
        return this.fallbackAvailabilityCheck(courtId, date, startTime, endTime);
      }

      // Function returns true if there IS a conflict, so we return the opposite
      return !data;
    } catch (error) {
      console.error('Error in checkCourtAvailability:', error);
      // Fall back to manual check if RPC fails
      return this.fallbackAvailabilityCheck(courtId, date, startTime, endTime);
    }
  }

  private static async fallbackAvailabilityCheck(
    courtId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('court_id', courtId)
        .eq('date', date)
        .eq('status', 'confirmed')
        .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

      if (error) {
        handleDatabaseError(error, 'check court availability (fallback)');
      }

      return !data || data.length === 0;
    } catch (error) {
      handleDatabaseError(error, 'check court availability (fallback)');
      return false;
    }
  }

  // New method to get available time slots for a court on a specific date
  static async getAvailableTimeSlots(
    courtId: string,
    date: string
  ): Promise<{ startTime: string; endTime: string; available: boolean }[]> {
    try {
      // Generate all possible time slots (8:00 - 22:00)
      const timeSlots = [];
      for (let hour = 8; hour <= 21; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        const available = await this.checkCourtAvailability(
          courtId, 
          date, 
          startTime, 
          endTime
        );
        
        timeSlots.push({
          startTime,
          endTime,
          available
        });
      }
      
      return timeSlots;
    } catch (error) {
      handleDatabaseError(error, 'get available time slots');
      return [];
    }
  }
}

// Users Service
export class UsersService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        handleDatabaseError(error, 'fetch user profile');
      }

      return data || null;
    } catch (error) {
      handleDatabaseError(error, 'fetch user profile');
      return null;
    }
  }

  static async updateUserProfile(
    userId: string,
    updates: Tables['users']['Update']
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        handleDatabaseError(error, 'update user profile');
      }
    } catch (error) {
      handleDatabaseError(error, 'update user profile');
    }
  }

  static async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .limit(10);

      if (error) {
        handleDatabaseError(error, 'search users');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'search users');
      return [];
    }
  }
}

// Real-time subscriptions with proper channel management
export class RealtimeService {
  private static activeChannels = new Map<string, any>();

  static subscribeToUserBookings(userId: string, callback: (payload: any) => void) {
    const channelName = `user-bookings-${userId}`;
    
    // Remove existing channel if it exists
    if (this.activeChannels.has(channelName)) {
      const existingChannel = this.activeChannels.get(channelName);
      supabase.removeChannel(existingChannel);
      this.activeChannels.delete(channelName);
    }

    // Create new channel
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    // Store the channel reference
    this.activeChannels.set(channelName, channel);
    
    return channel;
  }

  static subscribeToCourtBookings(courtId: string, callback: (payload: any) => void) {
    const channelName = `court-bookings-${courtId}`;
    
    // Remove existing channel if it exists
    if (this.activeChannels.has(channelName)) {
      const existingChannel = this.activeChannels.get(channelName);
      supabase.removeChannel(existingChannel);
      this.activeChannels.delete(channelName);
    }

    // Create new channel
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `court_id=eq.${courtId}`
        },
        callback
      )
      .subscribe();

    // Store the channel reference
    this.activeChannels.set(channelName, channel);
    
    return channel;
  }

  static unsubscribe(subscription: any) {
    if (subscription) {
      // Find and remove from active channels
      for (const [channelName, channel] of this.activeChannels.entries()) {
        if (channel === subscription) {
          this.activeChannels.delete(channelName);
          break;
        }
      }
      
      return supabase.removeChannel(subscription);
    }
  }

  static cleanup() {
    // Clean up all active channels
    for (const [channelName, channel] of this.activeChannels.entries()) {
      supabase.removeChannel(channel);
    }
    this.activeChannels.clear();
  }
}