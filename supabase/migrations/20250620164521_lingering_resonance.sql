/*
  # Fix infinite recursion in match_players RLS policy

  1. Problem
    - The current RLS policy for match_players table causes infinite recursion
    - The policy tries to query match_players table within its own USING clause
    - This creates a circular dependency during policy evaluation

  2. Solution
    - Drop the existing problematic policy
    - Create a new policy that directly checks if the user has access to the match
    - Remove the self-referencing JOIN that causes the recursion

  3. Changes
    - Drop "Users can read match players" policy
    - Create new "Users can read match players for their matches" policy
    - Use direct match_id check instead of self-referencing join
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can read match players" ON match_players;

-- Create a corrected policy that avoids self-reference
CREATE POLICY "Users can read match players for their matches"
  ON match_players
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_players.match_id
    )
  );