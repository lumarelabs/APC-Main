/*
  # Initial Schema Setup for Court Booking App

  1. New Tables
    - users (extends Supabase auth.users)
      - id (uuid, matches auth.users)
      - full_name (text)
      - level (text)
      - profile_image_url (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - courts
      - id (uuid)
      - name (text)
      - type (text, either 'padel' or 'pickleball')
      - price_per_hour (integer)
      - image_url (text)
      - rating (numeric)
      - location (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - bookings
      - id (uuid)
      - court_id (uuid, references courts)
      - user_id (uuid, references auth.users)
      - date (date)
      - start_time (time)
      - end_time (time)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - matches
      - id (uuid)
      - booking_id (uuid, references bookings)
      - status (text)
      - result (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - match_players
      - id (uuid)
      - match_id (uuid, references matches)
      - user_id (uuid, references auth.users)
      - team (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table that extends auth.users
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  level text,
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courts table
CREATE TABLE courts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('padel', 'pickleball')),
  price_per_hour integer NOT NULL,
  image_url text,
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id uuid REFERENCES courts NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed')),
  result text CHECK (result IN ('win', 'loss')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create match_players table
CREATE TABLE match_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  team text NOT NULL CHECK (team IN ('home', 'away')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Courts are readable by everyone"
  ON courts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM match_players
    WHERE match_players.match_id = matches.id
    AND match_players.user_id = auth.uid()
  ));

CREATE POLICY "Users can read match players"
  ON match_players
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM matches m
    JOIN match_players mp ON mp.match_id = m.id
    WHERE mp.user_id = auth.uid()
    AND match_players.match_id = m.id
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courts_updated_at
  BEFORE UPDATE ON courts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();