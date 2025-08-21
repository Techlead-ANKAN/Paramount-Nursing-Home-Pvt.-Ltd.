-- Migrate Existing Cancelled Bookings
-- Run this SQL in your Supabase SQL Editor

-- First, let's see what we have in the bookings table
SELECT 
  status,
  COUNT(*) as count
FROM bookings 
GROUP BY status;

-- Move cancelled bookings to the new cancelled_bookings table
INSERT INTO cancelled_bookings (
  original_booking_id,
  patient_id,
  doctor_id,
  booking_date,
  booking_time,
  cancellation_reason,
  cancelled_by,
  notes,
  created_at
)
SELECT 
  id as original_booking_id,
  patient_id,
  doctor_id,
  booking_date,
  booking_time,
  CASE 
    WHEN status = 'cancelled' THEN 'admin_cancelled'
    WHEN status = 'no_show' THEN 'no_show'
    ELSE 'admin_cancelled'
  END as cancellation_reason,
  'admin' as cancelled_by,
  notes,
  created_at
FROM bookings 
WHERE status IN ('cancelled', 'no_show');

-- Delete cancelled bookings from the main bookings table
DELETE FROM bookings 
WHERE status IN ('cancelled', 'no_show');

-- Add constraint to prevent invalid statuses in the future
ALTER TABLE bookings 
ADD CONSTRAINT check_booking_status 
CHECK (status IN ('pending', 'confirmed', 'completed'));

-- Verify the migration
SELECT 
  'bookings' as table_name,
  status,
  COUNT(*) as count
FROM bookings 
GROUP BY status

UNION ALL

SELECT 
  'cancelled_bookings' as table_name,
  cancellation_reason,
  COUNT(*) as count
FROM cancelled_bookings 
GROUP BY cancellation_reason;

-- Show final counts
SELECT 
  'Total Active Bookings' as description,
  COUNT(*) as count
FROM bookings

UNION ALL

SELECT 
  'Total Cancelled Bookings' as description,
  COUNT(*) as count
FROM cancelled_bookings;

