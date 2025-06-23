/*
  # Database cleanup and lesson booking implementation

  1. Remove unused tables
    - Drop matches table
    - Drop match_players table
    - Clean up related policies and functions

  2. Add lesson booking support
    - Add lessons table for lesson types and instructors
    - Add lesson_id to bookings table
    - Add includes_lighting to bookings table for night rate tracking

  3. Security updates
    - Update RLS policies for new structure
    - Ensure proper access control
*/

-- Drop unused tables and their policies
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

-- Create lessons table for lesson booking
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('private', 'group')),
  description text,
  price integer NOT NULL, -- Price in TL
  duration_weeks integer DEFAULT 1,
  sessions_per_week integer DEFAULT 1,
  max_participants integer DEFAULT 1,
  instructor_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add lesson support to bookings table
DO $$
BEGIN
  -- Add lesson_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'lesson_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN lesson_id uuid REFERENCES lessons(id);
  END IF;

  -- Add includes_lighting column for night rate tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'includes_lighting'
  ) THEN
    ALTER TABLE bookings ADD COLUMN includes_lighting boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS on lessons table
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for lessons table
CREATE POLICY "Lessons are readable by everyone"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default lesson types
INSERT INTO lessons (title, type, description, price, duration_weeks, sessions_per_week, max_participants, instructor_name) VALUES
  ('Özel Ders', 'private', 'Birebir özel padel dersi', 1000, 1, 1, 1, 'Profesyonel Eğitmen'),
  ('Grup Dersi', 'group', 'Max 4 kişilik grup dersi - 3 haftalık program', 7500, 3, 2, 4, 'Profesyonel Eğitmen')
ON CONFLICT DO NOTHING;

-- Update trigger for lessons table
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update court prices to correct values (2000 TL for both types)
UPDATE courts SET price_per_hour = 2000 WHERE type IN ('padel', 'pickleball');