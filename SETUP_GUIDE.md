# 🏥 Paramount Nursing Home - Setup Guide

This guide will walk you through setting up the complete OPD website with all necessary configurations.

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher) installed
- Git installed
- A code editor (VS Code recommended)
- Modern web browser

## 🚀 Step-by-Step Setup

### 1. Project Structure
```
Paramount Nursing Home Pvt. Ltd/
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── supabase/
│   │   └── App.jsx
│   ├── package.json
│   ├── README.md
│   └── env.example
└── SETUP_GUIDE.md
```

### 2. Install Dependencies
```bash
cd FRONTEND
npm install
```

### 3. Supabase Setup

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `paramount-nursing-home`
   - Database Password: (create a strong password)
   - Region: Choose closest to your location
6. Click "Create new project"
7. Wait for project to be ready (2-3 minutes)

#### B. Get API Keys
1. In your Supabase dashboard, go to Settings > API
2. Copy the following:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon public key (starts with `eyJ...`)

#### C. Create Database Tables
1. Go to SQL Editor in your Supabase dashboard
2. Run the following SQL commands:

```sql
-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  experience INTEGER NOT NULL,
  consultation_timings TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
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

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### D. Insert Sample Data
```sql
INSERT INTO doctors (name, specialty, experience, consultation_timings) VALUES
('Dr. Sarah Johnson', 'Cardiology', 15, 'Mon-Fri: 9:00 AM - 5:00 PM'),
('Dr. Michael Chen', 'Orthopedics', 12, 'Mon-Sat: 8:00 AM - 6:00 PM'),
('Dr. Emily Davis', 'Pediatrics', 10, 'Mon-Fri: 10:00 AM - 4:00 PM'),
('Dr. Robert Wilson', 'Neurology', 18, 'Tue-Sat: 9:00 AM - 5:00 PM'),
('Dr. Lisa Brown', 'Gynecology', 14, 'Mon-Fri: 8:00 AM - 6:00 PM');
```

### 4. Clerk Authentication Setup

#### A. Create Clerk Application
1. Go to [clerk.com](https://clerk.com)
2. Sign up/Login with your account
3. Click "Add Application"
4. Choose "Web Application"
5. Enter application details:
   - Name: `Paramount Nursing Home`
   - URL: `http://localhost:5173` (for development)
6. Click "Create Application"

#### B. Configure Authentication
1. In your Clerk dashboard, go to "User & Authentication"
2. Enable Email/Password authentication
3. Optionally enable social logins (Google, GitHub, etc.)
4. Go to "API Keys" and copy your Publishable Key

#### C. Configure Redirect URLs
1. Go to "Paths" in your Clerk dashboard
2. Add these redirect URLs:
   - `http://localhost:5173/sign-in`
   - `http://localhost:5173/sign-up`
   - `http://localhost:5173/*`

### 5. Environment Configuration

#### A. Create Environment File
1. In the `FRONTEND` directory, create a `.env` file
2. Copy the content from `env.example`
3. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 6. Start Development Server

```bash
npm run dev
```

Your application should now be running at `http://localhost:5173`

## 🔧 Configuration Details

### Supabase Row Level Security (RLS)
For production, you may want to enable RLS policies:

```sql
-- Enable RLS on tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Example policy for public read access to doctors
CREATE POLICY "Doctors are viewable by everyone" ON doctors
  FOR SELECT USING (true);

-- Example policy for authenticated users to create bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Production Deployment

#### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

#### Netlify Deployment
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Set build command: `npm run build`
5. Set publish directory: `dist`

## 🧪 Testing the Application

### 1. Test Home Page
- Navigate to `http://localhost:5173`
- Verify all sections load correctly
- Test responsive design on different screen sizes

### 2. Test Doctor List
- Go to `/doctors`
- Verify doctors are displayed
- Test search and filter functionality

### 3. Test Booking System
- Go to `/booking`
- Fill out the booking form
- Submit and verify booking is created in Supabase

### 4. Test Authentication
- Try signing up with a new account
- Sign in with existing account
- Verify protected routes work

### 5. Test Admin Features
- Go to `/registration-list`
- Verify all bookings are displayed
- Test status updates

## 🔍 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
- Ensure `.env` file is in the correct location
- Restart the development server
- Check for typos in variable names

#### 2. Supabase Connection Issues
- Verify your Supabase URL and key are correct
- Check if your Supabase project is active
- Ensure tables are created correctly

#### 3. Clerk Authentication Issues
- Verify your Clerk publishable key is correct
- Check redirect URLs are configured properly
- Ensure authentication methods are enabled

#### 4. Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for version conflicts in package.json
- Update Node.js if using an older version

### Debug Mode
To enable debug logging, add to your `.env`:
```env
VITE_DEBUG=true
```

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check Supabase and Clerk dashboards for configuration issues

## 🎉 Next Steps

After successful setup:
1. Customize the content for your specific hospital
2. Add your hospital's branding and colors
3. Configure additional authentication methods
4. Set up email notifications
5. Add more features as needed

---

**Happy coding! 🚀**
