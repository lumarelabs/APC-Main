/*
  # Fix infinite recursion in match_players RLS policy

  1. Problem
    - The current RLS policy for match_players table causes infinite recursion
    - The policy tries to query matches table which likely has its own policy referencing match_players
    - This creates a circular dependency during policy evaluation

  2. Solution
    - Drop the existing problematic policy
    - Create a new policy that directly checks if the user owns the match player record
    - Use direct user_id check instead of referencing matches table

  3. Changes
    - Drop "Users can read match players for their matches" policy
    - Create new "Users can read their own match players" policy
    - Use auth.uid() = user_id check to avoid circular dependencies
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can read match players for their matches" ON match_players;

-- Create a corrected policy that directly checks user ownership
CREATE POLICY "Users can read their own match players"
  ON match_players
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);