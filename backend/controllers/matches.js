const { supabase } = require('../config/supabase');

class MatchController {
  // Get all matches for authenticated user
  async getUserMatches(req, res, next) {
    try {
      const { status } = req.query;

      let query = supabase
        .from('matches')
        .select(`
          *,
          bookings (
            id,
            date,
            start_time,
            end_time,
            courts (
              id,
              name,
              type,
              location
            )
          ),
          match_players (
            id,
            user_id,
            team,
            users (
              id,
              full_name,
              level,
              profile_image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      // Filter matches where user is a participant
      const { data: userMatches, error: matchError } = await supabase
        .from('match_players')
        .select('match_id')
        .eq('user_id', req.userId);

      if (matchError) {
        throw matchError;
      }

      const matchIds = userMatches.map(mp => mp.match_id);
      
      if (matchIds.length === 0) {
        return res.json({
          success: true,
          data: [],
          count: 0
        });
      }

      query = query.in('id', matchIds);

      if (status && ['pending', 'confirmed', 'completed'].includes(status)) {
        query = query.eq('status', status);
      }

      const { data: matches, error } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: matches,
        count: matches.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new match
  async createMatch(req, res, next) {
    try {
      const matchData = req.body;

      // Verify the booking belongs to the user
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, user_id')
        .eq('id', matchData.booking_id)
        .eq('user_id', req.userId)
        .single();

      if (bookingError || !booking) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Booking not found or you do not have permission to create a match for it'
        });
      }

      const { data: match, error } = await supabase
        .from('matches')
        .insert(matchData)
        .select(`
          *,
          bookings (
            id,
            date,
            start_time,
            end_time,
            courts (
              id,
              name,
              type,
              location
            )
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        success: true,
        data: match,
        message: 'Match created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update match
  async updateMatch(req, res, next) {
    try {
      const { id } = req.params;
      const updates = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      // Verify user is a participant in the match
      const { data: participation, error: participationError } = await supabase
        .from('match_players')
        .select('id')
        .eq('match_id', id)
        .eq('user_id', req.userId)
        .single();

      if (participationError || !participation) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to update this match'
        });
      }

      const { data: match, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          bookings (
            id,
            date,
            start_time,
            end_time,
            courts (
              id,
              name,
              type,
              location
            )
          ),
          match_players (
            id,
            user_id,
            team,
            users (
              id,
              full_name,
              level,
              profile_image_url
            )
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: match,
        message: 'Match updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Add player to match
  async addPlayer(req, res, next) {
    try {
      const { matchId } = req.params;
      const playerData = {
        ...req.body,
        match_id: matchId
      };

      // Verify user is a participant in the match (to add other players)
      const { data: participation, error: participationError } = await supabase
        .from('match_players')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', req.userId)
        .single();

      if (participationError || !participation) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to add players to this match'
        });
      }

      const { data: player, error } = await supabase
        .from('match_players')
        .insert(playerData)
        .select(`
          *,
          users (
            id,
            full_name,
            level,
            profile_image_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        success: true,
        data: player,
        message: 'Player added to match successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove player from match
  async removePlayer(req, res, next) {
    try {
      const { matchId, userId } = req.params;

      // Verify user is a participant in the match or removing themselves
      const { data: participation, error: participationError } = await supabase
        .from('match_players')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', req.userId)
        .single();

      if (participationError || (!participation && userId !== req.userId)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to remove this player from the match'
        });
      }

      const { error } = await supabase
        .from('match_players')
        .delete()
        .eq('match_id', matchId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        message: 'Player removed from match successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();