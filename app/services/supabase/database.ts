import { supabase } from './config';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type Court = Tables['courts']['Row'];
type Booking = Tables['bookings']['Row'];
type Match = Tables['matches']['Row'];
type MatchPlayer = Tables['match_players']['Row'];
type UserProfile = Tables['users']['Row'];

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

// Bookings Service
export class BookingsService {
  static async getUserBookings(userId: string): Promise<(Booking & { court: Court })[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(*)
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
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        handleDatabaseError(error, 'create booking');
      }

      return data;
    } catch (error) {
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
        handleDatabaseError(error, 'update booking status');
      }
    } catch (error) {
      handleDatabaseError(error, 'update booking status');
    }
  }

  static async getBookingsByDateRange(
    startDate: string, 
    endDate: string
  ): Promise<(Booking & { court: Court })[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(*)
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
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('court_id', courtId)
        .eq('date', date)
        .eq('status', 'confirmed')
        .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

      if (error) {
        handleDatabaseError(error, 'check court availability');
      }

      return !data || data.length === 0;
    } catch (error) {
      handleDatabaseError(error, 'check court availability');
      return false;
    }
  }
}

// Matches Service
export class MatchesService {
  static async getUserMatches(userId: string): Promise<(Match & { 
    booking: Booking & { court: Court };
    players: (MatchPlayer & { user: UserProfile })[];
  })[]> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          booking:bookings(
            *,
            court:courts(*)
          ),
          players:match_players(
            *,
            user:users(*)
          )
        `)
        .eq('players.user_id', userId)
        .order('booking.date', { ascending: false });

      if (error) {
        handleDatabaseError(error, 'fetch user matches');
      }

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch user matches');
      return [];
    }
  }

  static async createMatch(
    bookingId: string,
    players: { user_id: string; team: 'home' | 'away' }[]
  ): Promise<Match> {
    try {
      // Create match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert({ booking_id: bookingId })
        .select()
        .single();

      if (matchError) {
        handleDatabaseError(matchError, 'create match');
      }

      // Add players
      const playersData = players.map(player => ({
        match_id: match.id,
        user_id: player.user_id,
        team: player.team
      }));

      const { error: playersError } = await supabase
        .from('match_players')
        .insert(playersData);

      if (playersError) {
        handleDatabaseError(playersError, 'add match players');
      }

      return match;
    } catch (error) {
      handleDatabaseError(error, 'create match');
      throw error;
    }
  }

  static async updateMatchResult(
    matchId: string,
    result: 'win' | 'loss'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ result, status: 'completed' })
        .eq('id', matchId);

      if (error) {
        handleDatabaseError(error, 'update match result');
      }
    } catch (error) {
      handleDatabaseError(error, 'update match result');
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
        .single();

      if (error && error.code !== 'PGRST116') {
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

// Real-time subscriptions
export class RealtimeService {
  static subscribeToUserBookings(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-bookings')
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
  }

  static subscribeToCourtBookings(courtId: string, callback: (payload: any) => void) {
    return supabase
      .channel('court-bookings')
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
  }

  static unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
  }
}