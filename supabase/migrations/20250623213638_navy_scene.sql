/*
  # Fix booking conflicts with unique constraints

  1. Problem
    - Multiple users can book the same court at the same time
    - No database-level constraint prevents double booking
    - Race conditions can occur during booking creation

  2. Solution
    - Add unique constraint on (court_id, date, start_time, end_time) for confirmed bookings
    - Add application-level validation before booking creation
    - Handle overlapping time slots properly

  3. Changes
    - Create unique index for confirmed bookings
    - Add function to check booking conflicts
    - Update booking policies to prevent conflicts
*/

-- Create unique constraint to prevent double booking
-- Only apply to confirmed bookings (pending can overlap temporarily)
CREATE UNIQUE INDEX IF NOT EXISTS unique_confirmed_bookings 
ON bookings (court_id, date, start_time, end_time) 
WHERE status = 'confirmed';

-- Create function to check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_court_id uuid,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_booking_id uuid DEFAULT NULL
) RETURNS boolean AS $$
BEGIN
  -- Check if there's any confirmed booking that overlaps with the requested time
  RETURN EXISTS (
    SELECT 1 FROM bookings
    WHERE court_id = p_court_id
    AND date = p_date
    AND status = 'confirmed'
    AND (p_booking_id IS NULL OR id != p_booking_id) -- Exclude current booking if updating
    AND (
      -- Check for any time overlap
      (start_time < p_end_time AND end_time > p_start_time)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to validate booking before insert/update
CREATE OR REPLACE FUNCTION validate_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate confirmed bookings
  IF NEW.status = 'confirmed' THEN
    -- Check for conflicts
    IF check_booking_conflict(NEW.court_id, NEW.date, NEW.start_time, NEW.end_time, NEW.id) THEN
      RAISE EXCEPTION 'Bu kort ve saat için zaten onaylanmış bir rezervasyon bulunmaktadır.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate bookings
DROP TRIGGER IF EXISTS validate_booking_trigger ON bookings;
CREATE TRIGGER validate_booking_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking();

-- Add helpful comment
COMMENT ON INDEX unique_confirmed_bookings IS 'Prevents double booking of the same court at the same time for confirmed reservations';
COMMENT ON FUNCTION check_booking_conflict IS 'Checks if a booking conflicts with existing confirmed bookings';
COMMENT ON FUNCTION validate_booking IS 'Validates booking to prevent conflicts before insert/update';