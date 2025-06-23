/*
  # Add skill level support to users table

  1. Changes
    - Add level column to users table if it doesn't exist
    - Set default value to 'Başlangıç'
    - Update existing users to have default level if null

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add level column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'level'
  ) THEN
    ALTER TABLE users ADD COLUMN level text DEFAULT 'Başlangıç';
  END IF;
END $$;

-- Update existing users to have default level if null
UPDATE users SET level = 'Başlangıç' WHERE level IS NULL;

-- Add check constraint for valid skill levels
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'users_level_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_level_check 
    CHECK (level IN ('Başlangıç', 'Orta', 'İleri'));
  END IF;
END $$;