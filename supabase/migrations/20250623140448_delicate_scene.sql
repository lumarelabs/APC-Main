/*
  # Fix pricing system to use Turkish Lira directly

  1. Changes
    - Update price_per_hour column to store prices in Turkish Lira (not cents)
    - Update existing court prices to proper TL values
    - Remove cent-based calculations from application

  2. Price Updates
    - Padel courts: 350 TL per hour
    - Pickleball courts: 250 TL per hour
*/

-- Update existing court prices to proper TL values
UPDATE courts SET price_per_hour = 350 WHERE type = 'padel';
UPDATE courts SET price_per_hour = 250 WHERE type = 'pickleball';

-- Add comment to clarify that prices are in Turkish Lira
COMMENT ON COLUMN courts.price_per_hour IS 'Price per hour in Turkish Lira (TL)';