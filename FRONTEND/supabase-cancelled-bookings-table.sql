-- Create Cancelled Bookings Table
-- Run this SQL in your Supabase SQL Editor AFTER fixing the bookings table

CREATE TABLE cancelled_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  cancellation_reason VARCHAR(255) NOT NULL, -- 'patient_cancelled', 'no_show', 'admin_cancelled'
  cancelled_by VARCHAR(50) NOT NULL, -- 'patient', 'admin', 'system'
  cancelled_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_cancelled_bookings_patient_id ON cancelled_bookings(patient_id);
CREATE INDEX idx_cancelled_bookings_doctor_id ON cancelled_bookings(doctor_id);
CREATE INDEX idx_cancelled_bookings_cancelled_at ON cancelled_bookings(cancelled_at);
CREATE INDEX idx_cancelled_bookings_cancellation_reason ON cancelled_bookings(cancellation_reason);
CREATE INDEX idx_cancelled_bookings_original_booking_id ON cancelled_bookings(original_booking_id);

-- Disable RLS for the new table (for public access)
ALTER TABLE cancelled_bookings DISABLE ROW LEVEL SECURITY;

-- Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'cancelled_bookings'
ORDER BY ordinal_position;
