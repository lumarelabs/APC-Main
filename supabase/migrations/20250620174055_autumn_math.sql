/*
  # Add Google OAuth support and improve user profile handling

  1. Changes
    - Add role column to users table with default 'user'
    - Add email column to users table for better profile management
    - Update user profile policies to handle OAuth users
    - Ensure proper indexing for performance

  2. Security
    - Maintain existing RLS policies
    - Add policy for users to insert their own profile during OAuth signup
*/

-- Add missing columns to users table if they don't exist
DO $$
BEGIN
  -- Add role column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'user';
  END IF;

  -- Add email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE users ADD COLUMN email text;
  END IF;
END $$;

-- Add policy for users to insert their own profile (needed for OAuth)
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create index on email for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Create index on role for better performance
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);