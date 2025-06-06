const { supabase } = require('../config/supabase');

class CourtController {
  // Get all courts with optional filtering
  async getAllCourts(req, res, next) {
    try {
      const { type, location, min_rating, max_price } = req.query;
      
      let query = supabase
        .from('courts')
        .select('*')
        .order('name');

      // Apply filters
      if (type && ['padel', 'pickleball'].includes(type)) {
        query = query.eq('type', type);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (min_rating) {
        query = query.gte('rating', parseFloat(min_rating));
      }

      if (max_price) {
        query = query.lte('price_per_hour', parseInt(max_price));
      }

      const { data: courts, error } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: courts,
        count: courts.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single court by ID
  async getCourtById(req, res, next) {
    try {
      const { id } = req.params;

      const { data: court, error } = await supabase
        .from('courts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            error: 'Not Found',
            message: 'Court not found'
          });
        }
        throw error;
      }

      res.json({
        success: true,
        data: court
      });
    } catch (error) {
      next(error);
    }
  }

  // Get court availability for a specific date
  async getCourtAvailability(req, res, next) {
    try {
      const { id } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Date parameter is required'
        });
      }

      // Get all bookings for this court on the specified date
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('start_time, end_time, status')
        .eq('court_id', id)
        .eq('date', date)
        .in('status', ['pending', 'confirmed']);

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: {
          court_id: id,
          date,
          bookings: bookings || []
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourtController();