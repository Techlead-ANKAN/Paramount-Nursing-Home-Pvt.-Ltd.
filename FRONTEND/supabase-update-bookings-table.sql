-- Update Bookings Table Structure
-- Run this SQL in your Supabase SQL Editor

-- First, let's see the current bookings data
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
    ELSE 'no_show'
  END as cancellation_reason,
  'admin' as cancelled_by,
  notes,
  created_at
FROM bookings 
WHERE status IN ('cancelled', 'no_show');

-- Delete cancelled bookings from the main bookings table
DELETE FROM bookings 
WHERE status IN ('cancelled', 'no_show');

-- Update the status field to only allow 'pending', 'confirmed', 'completed'
-- Add a check constraint to prevent invalid statuses
ALTER TABLE bookings 
ADD CONSTRAINT check_booking_status 
CHECK (status IN ('pending', 'confirmed', 'completed'));

-- Verify the changes
SELECT 
  status,
  COUNT(*) as count
FROM bookings 
GROUP BY status;

-- Check cancelled bookings table
SELECT 
  cancellation_reason,
  COUNT(*) as count
FROM cancelled_bookings 
GROUP BY cancellation_reason;

