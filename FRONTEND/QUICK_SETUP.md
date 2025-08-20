# 🚀 Quick Setup Guide

## Step 1: Create Environment File
Create a `.env` file in the FRONTEND directory with your credentials:

```env
VITE_SUPABASE_URL=https://idrgotjuuafemwedfnep.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcmdvdGp1dWFmZW13ZWRmbmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDMzOTEsImV4cCI6MjA3MTI3OTM5MX0.q-2IPOoJA1Rd0rA-F2Zi2EOuO3BuVbhrSm8QpaVz71c
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LWltcGFsYS0wLmNsZXJrLmFjY291bnRzLmRldiQ
```

## Step 2: Set Up Supabase Database
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Open your project: `idrgotjuuafemwedfnep`
3. Go to SQL Editor
4. Copy and paste the entire content from `supabase-setup.sql`
5. Click "Run" to create all tables and sample data

## Step 3: Install Dependencies & Start
```bash
cd FRONTEND
npm install
npm run dev
```

## Step 4: Test the Application
1. Open http://localhost:5173
2. Test the following features:
   - ✅ Home page loads
   - ✅ Doctors list shows 8 sample doctors
   - ✅ Booking form works
   - ✅ Contact form works
   - ✅ Authentication with Clerk

## 🎉 You're Ready!
Your OPD website is now fully functional with:
- 8 sample doctors
- Complete booking system
- Patient registration
- Contact form
- Authentication system
- Responsive design

## 🔧 Troubleshooting
If you encounter issues:
1. Check browser console for errors
2. Verify environment variables are correct
3. Ensure Supabase tables are created
4. Restart the development server
