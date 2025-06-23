/*
  # Comprehensive Database Cleanup and Fixes

  1. Problem Resolution
    - Drop tables in correct order to avoid foreign key conflicts
    - Remove unused match-related tables safely
    - Add proper lesson booking support
    - Fix court pricing to 2000 TL for both types
    - Add lighting fee tracking

  2. New Features
    - Lessons table for lesson types and pricing
    - Enhanced bookings table with lesson_id and includes_lighting
    - Proper foreign key relationships

  3. Security
    - Maintain existing RLS policies
    - Add policies for new tables
    - Ensure proper user access control
*/

-- Step 1: Drop dependent tables first (in correct order)
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

-- Step 2: Create lessons table for lesson booking
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('private', 'group')),
  description text,
  price integer NOT NULL, -- Price in Turkish Lira (TL)
  duration_weeks integer DEFAULT 1,
  sessions_per_week integer DEFAULT 1,
  max_participants integer DEFAULT 1,
  instructor_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Add lesson support to bookings table
DO $$
BEGIN
  -- Add lesson_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'lesson_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN lesson_id uuid REFERENCES lessons(id);
  END IF;

  -- Add includes_lighting column for night rate tracking (after 20:30)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'includes_lighting'
  ) THEN
    ALTER TABLE bookings ADD COLUMN includes_lighting boolean DEFAULT false;
  END IF;
END $$;

-- Step 4: Enable RLS on lessons table
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for lessons table
CREATE POLICY IF NOT EXISTS "Lessons are readable by everyone"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Step 6: Insert default lesson types with correct pricing
INSERT INTO lessons (title, type, description, price, duration_weeks, sessions_per_week, max_participants, instructor_name) VALUES
  ('Özel Ders', 'private', 'Birebir özel padel dersi', 1000, 1, 1, 1, 'Profesyonel Eğitmen'),
  ('Grup Dersi', 'group', 'Max 4 kişilik grup dersi - 3 haftalık program (haftada 2 gün)', 7500, 3, 2, 4, 'Profesyonel Eğitmen')
ON CONFLICT DO NOTHING;

-- Step 7: Create trigger for lessons table
CREATE TRIGGER IF NOT EXISTS update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Update court prices to correct values (2000 TL for both types)
UPDATE courts SET price_per_hour = 2000 WHERE type IN ('padel', 'pickleball');

-- Step 9: Add helpful comments
COMMENT ON COLUMN courts.price_per_hour IS 'Price per hour in Turkish Lira (TL)';
COMMENT ON COLUMN lessons.price IS 'Lesson price in Turkish Lira (TL)';
COMMENT ON COLUMN bookings.includes_lighting IS 'True if booking is after 20:30 and includes 300 TL lighting fee';

-- Step 10: Verify foreign key relationships exist
DO $$
BEGIN
  -- Ensure bookings -> users foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_user_id_fkey'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id);
  END IF;

  -- Ensure bookings -> courts foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_court_id_fkey'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_court_id_fkey 
    FOREIGN KEY (court_id) REFERENCES courts(id);
  END IF;
END $$;