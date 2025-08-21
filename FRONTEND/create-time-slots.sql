-- Create Time Slots Configuration
-- Run this SQL in your Supabase SQL Editor

-- 1. Create time slots table for appointment booking
CREATE TABLE time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_time TIME NOT NULL,
  slot_duration INTEGER DEFAULT 30, -- minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert default time slots (30-minute intervals from 9 AM to 6 PM)
INSERT INTO time_slots (slot_time, slot_duration) VALUES
('09:00:00', 30),
('09:30:00', 30),
('10:00:00', 30),
('10:30:00', 30),
('11:00:00', 30),
('11:30:00', 30),
('12:00:00', 30),
('12:30:00', 30),
('13:00:00', 30),
('13:30:00', 30),
('14:00:00', 30),
('14:30:00', 30),
('15:00:00', 30),
('15:30:00', 30),
('16:00:00', 30),
('16:30:00', 30),
('17:00:00', 30),
('17:30:00', 30),
('18:00:00', 30),
('18:30:00', 30),
('19:00:00', 30),
('19:30:00', 30),
('20:00:00', 30),
('20:30:00', 30),
('21:00:00', 30),
('21:30:00', 30),
('22:00:00', 30),
('22:30:00', 30);

-- 3. Create available slots table to track which slots are available for each doctor on each date
CREATE TABLE available_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(doctor_id, slot_date, slot_time)
);

-- 4. Add indexes for better performance
CREATE INDEX idx_available_slots_doctor_date ON available_slots(doctor_id, slot_date);
CREATE INDEX idx_available_slots_available ON available_slots(is_available);
CREATE INDEX idx_time_slots_active ON time_slots(is_active);

-- 5. Disable RLS for the new tables
ALTER TABLE time_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots DISABLE ROW LEVEL SECURITY;

-- 6. Verify the tables were created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('time_slots', 'available_slots')
ORDER BY table_name, ordinal_position;

-- 7. Show sample time slots
SELECT 
  slot_time,
  slot_duration,
  is_active
FROM time_slots
ORDER BY slot_time;

