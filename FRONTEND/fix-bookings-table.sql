-- Fix Bookings Table Structure
-- Run this SQL in your Supabase SQL Editor FIRST

-- 1. Drop the existing composite primary key
ALTER TABLE bookings DROP CONSTRAINT bookings_pkey;

-- 2. Create a proper primary key on just the id column
ALTER TABLE bookings ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);

-- 3. Remove the problematic default values from foreign keys
ALTER TABLE bookings ALTER COLUMN patient_id DROP DEFAULT;
ALTER TABLE bookings ALTER COLUMN doctor_id DROP DEFAULT;

-- 4. Add a unique constraint on patient_id if needed (optional)
-- ALTER TABLE bookings ADD CONSTRAINT bookings_patient_id_unique UNIQUE (patient_id);

-- 5. Verify the changes
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'bookings';

-- 6. Check the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

