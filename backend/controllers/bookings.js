const { supabase } = require('../config/supabase');

class BookingController {
  // Get all bookings for authenticated user
  async getUserBookings(req, res, next) {
    try {
      const { status, date_from, date_to } = req.query;
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          courts (
            id,
            name,
            type,
            price_per_hour,
            image_url,
            location
          )
        `)
        .eq('user_id', req.userId)
        .order('date', { ascending: false })
        .order('start_time', { ascending: false });

      // Apply filters
      if (status && ['pending', 'confirmed', 'canceled'].includes(status)) {
        query = query.eq('status', status);
      }

      if (date_from) {
        query = query.gte('date', date_from);
      }

      if (date_to) {
        query = query.lte('date', date_to);
      }

      const { data: bookings, error } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new booking
  async createBooking(req, res, next) {
    try {
      const bookingData = {
        ...req.body,
        user_id: req.userId
      };

      // Check for time conflicts
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('court_id', bookingData.court_id)
        .eq('date', bookingData.date)
        .in('status', ['pending', 'confirmed'])
        .or(`and(start_time.lte.${bookingData.end_time},end_time.gte.${bookingData.start_time})`);

      if (checkError) {
        throw checkError;
      }

      if (existingBookings && existingBookings.length > 0) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Court is already booked for the selected time slot'
        });
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          *,
          courts (
            id,
            name,
            type,
            price_per_hour,
            image_url,
            location
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update booking status
  async updateBooking(req, res, next) {
    try {
      const { id } = req.params;
      const updates = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      const { data: booking, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .eq('user_id', req.userId) // Ensure user owns the booking
        .select(`
          *,
          courts (
            id,
            name,
            type,
            price_per_hour,
            image_url,
            location
          )
        `)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            error: 'Not Found',
            message: 'Booking not found or you do not have permission to update it'
          });
        }
        throw error;
      }

      res.json({
        success: true,
        data: booking,
        message: 'Booking updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get bookings for a specific court (for availability checking)
  async getCourtBookings(req, res, next) {
    try {
      const { courtId } = req.params;
      const { date_from, date_to } = req.query;

      let query = supabase
        .from('bookings')
        .select('id, date, start_time, end_time, status')
        .eq('court_id', courtId)
        .in('status', ['pending', 'confirmed'])
        .order('date')
        .order('start_time');

      if (date_from) {
        query = query.gte('date', date_from);
      }

      if (date_to) {
        query = query.lte('date', date_to);
      }

      const { data: bookings, error } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete booking (cancel)
  async deleteBooking(req, res, next) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .eq('user_id', req.userId);

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();