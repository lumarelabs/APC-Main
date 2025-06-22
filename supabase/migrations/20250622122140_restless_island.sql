/*
  # Fix infinite recursion in match_players RLS policy

  1. Problem
    - The current RLS policy for match_players table causes infinite recursion
    - This happens when the policy evaluation creates circular dependencies
    - The error occurs when trying to fetch user match IDs

  2. Solution
    - Drop ALL existing policies on match_players table to ensure clean slate
    - Create a simple, direct policy that only checks user ownership
    - Avoid any complex joins or subqueries that could cause recursion

  3. Changes
    - Drop all existing policies on match_players
    - Create new policy that directly checks auth.uid() = user_id
    - Add policies for INSERT and UPDATE operations as well
*/

-- Drop ALL existing policies on match_players table
DROP POLICY IF EXISTS "Users can read match players" ON match_players;
DROP POLICY IF EXISTS "Users can read match players for their matches" ON match_players;
DROP POLICY IF EXISTS "Users can read their own match players" ON match_players;

-- Create a simple, direct policy for SELECT operations
CREATE POLICY "Users can read their own match player records"
  ON match_players
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add policy for INSERT operations (users can create their own match player records)
CREATE POLICY "Users can insert their own match player records"
  ON match_players
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add policy for UPDATE operations (users can update their own match player records)
CREATE POLICY "Users can update their own match player records"
  ON match_players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add policy for DELETE operations (users can delete their own match player records)
CREATE POLICY "Users can delete their own match player records"
  ON match_players
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);