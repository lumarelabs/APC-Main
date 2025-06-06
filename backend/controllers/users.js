const { supabase } = require('../config/supabase');

class UserController {
  // Get user profile
  async getProfile(req, res, next) {
    try {
      const { id } = req.params;
      
      // Ensure user can only access their own profile
      if (id !== req.userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only access your own profile'
        });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            error: 'Not Found',
            message: 'User profile not found'
          });
        }
        throw error;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      
      // Ensure user can only update their own profile
      if (id !== req.userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only update your own profile'
        });
      }

      const updates = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      const { data: user, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Create user profile (called after Supabase auth signup)
  async createProfile(req, res, next) {
    try {
      const { full_name, level, profile_image_url } = req.body;
      
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          id: req.userId,
          full_name,
          level,
          profile_image_url
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        success: true,
        data: user,
        message: 'Profile created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();