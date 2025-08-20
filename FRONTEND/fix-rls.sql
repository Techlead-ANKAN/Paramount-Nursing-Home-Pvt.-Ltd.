-- Fix Row Level Security (RLS) for Paramount Nursing Home OPD Website
-- Run this SQL in your Supabase SQL Editor

-- 1. Disable RLS on doctors table (for public read access)
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;

-- 2. Disable RLS on patients table (for public insert access)
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- 3. Disable RLS on bookings table (for public insert/read access)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- 4. Disable RLS on contact_messages table (for public insert access)
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, use these policies instead:
-- (Uncomment the lines below and comment out the ALTER TABLE lines above)

/*
-- Enable RLS on all tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors table (public read access)
CREATE POLICY "Doctors are viewable by everyone" ON doctors
  FOR SELECT USING (true);

-- Create policies for patients table (public insert access)
CREATE POLICY "Anyone can create patients" ON patients
  FOR INSERT WITH CHECK (true);

-- Create policies for bookings table (public insert/read access)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view bookings" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update bookings" ON bookings
  FOR UPDATE USING (true);

-- Create policies for contact_messages table (public insert access)
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);
*/

-- 5. Verify the changes
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('doctors', 'patients', 'bookings', 'contact_messages');
