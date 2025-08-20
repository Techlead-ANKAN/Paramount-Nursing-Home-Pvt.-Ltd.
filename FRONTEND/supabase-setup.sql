-- Paramount Nursing Home OPD Website Database Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. Create Doctors Table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  experience INTEGER NOT NULL,
  consultation_timings TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Patients Table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Insert Sample Doctors Data
INSERT INTO doctors (name, specialty, experience, consultation_timings) VALUES
('Dr. Sarah Johnson', 'Cardiology', 15, 'Mon-Fri: 9:00 AM - 5:00 PM'),
('Dr. Michael Chen', 'Orthopedics', 12, 'Mon-Sat: 8:00 AM - 6:00 PM'),
('Dr. Emily Davis', 'Pediatrics', 10, 'Mon-Fri: 10:00 AM - 4:00 PM'),
('Dr. Robert Wilson', 'Neurology', 18, 'Tue-Sat: 9:00 AM - 5:00 PM'),
('Dr. Lisa Brown', 'Gynecology', 14, 'Mon-Fri: 8:00 AM - 6:00 PM'),
('Dr. James Anderson', 'Dermatology', 8, 'Mon-Fri: 9:00 AM - 4:00 PM'),
('Dr. Maria Garcia', 'Psychiatry', 16, 'Mon-Sat: 10:00 AM - 6:00 PM'),
('Dr. David Thompson', 'Ophthalmology', 11, 'Mon-Fri: 8:00 AM - 5:00 PM');

-- 6. Enable Row Level Security (Optional - for production)
-- ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 7. Create Basic RLS Policies (Optional - for production)
-- CREATE POLICY "Doctors are viewable by everyone" ON doctors FOR SELECT USING (true);
-- CREATE POLICY "Patients can be created by anyone" ON patients FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Bookings can be created by anyone" ON bookings FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Contact messages can be created by anyone" ON contact_messages FOR INSERT WITH CHECK (true);

-- 8. Verify Tables Created
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('doctors', 'patients', 'bookings', 'contact_messages')
ORDER BY table_name, ordinal_position;
