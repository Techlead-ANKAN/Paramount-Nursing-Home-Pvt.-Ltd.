-- Update Doctors Table Structure
-- Run this SQL in your Supabase SQL Editor

-- 1. Add registration_no column
ALTER TABLE doctors ADD COLUMN registration_no VARCHAR(100) UNIQUE;

-- 2. Rename consultation_timings to schedule (we'll replace it with structured data)
ALTER TABLE doctors RENAME COLUMN consultation_timings TO schedule_old;

-- 3. Add new structured schedule columns
ALTER TABLE doctors ADD COLUMN schedule JSONB DEFAULT '[]'::jsonb;

-- 4. Create a new table for doctor schedules
CREATE TABLE doctor_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week)
);

-- 5. Add indexes for better performance
CREATE INDEX idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE INDEX idx_doctor_schedules_day ON doctor_schedules(day_of_week);
CREATE INDEX idx_doctor_schedules_active ON doctor_schedules(is_active);

-- 6. Disable RLS for the new table
ALTER TABLE doctor_schedules DISABLE ROW LEVEL SECURITY;

-- 7. Update existing doctors with sample registration numbers
UPDATE doctors 
SET registration_no = 'REG-' || SUBSTRING(id::text, 1, 8)
WHERE registration_no IS NULL;

-- 8. Convert existing consultation_timings to structured schedule
-- This will create sample schedules based on existing data
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time)
SELECT 
  id as doctor_id,
  CASE 
    WHEN schedule_old ILIKE '%monday%' THEN 1
    WHEN schedule_old ILIKE '%tuesday%' THEN 2
    WHEN schedule_old ILIKE '%wednesday%' THEN 3
    WHEN schedule_old ILIKE '%thursday%' THEN 4
    WHEN schedule_old ILIKE '%friday%' THEN 5
    WHEN schedule_old ILIKE '%saturday%' THEN 6
    WHEN schedule_old ILIKE '%sunday%' THEN 0
    ELSE 1 -- Default to Monday if no day specified
  END as day_of_week,
  '09:00:00'::time as start_time,
  '17:00:00'::time as end_time
FROM doctors;

-- 9. Verify the changes
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'doctors'
ORDER BY ordinal_position;

-- 10. Show the new doctor_schedules table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'doctor_schedules'
ORDER BY ordinal_position;

-- 11. Show sample data
SELECT 
  d.name,
  d.registration_no,
  d.speciality,
  ds.day_of_week,
  ds.start_time,
  ds.end_time
FROM doctors d
LEFT JOIN doctor_schedules ds ON d.id = ds.doctor_id
ORDER BY d.name, ds.day_of_week;

