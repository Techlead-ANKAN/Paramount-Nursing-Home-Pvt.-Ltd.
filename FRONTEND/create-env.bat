@echo off
echo Creating .env file with your Supabase and Clerk credentials...

(
echo # Supabase Configuration
echo VITE_SUPABASE_URL=https://idrgotjuuafemwedfnep.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcmdvdGp1dWFmZW13ZWRmbmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDMzOTEsImV4cCI6MjA3MTI3OTM5MX0.q-2IPOoJA1Rd0rA-F2Zi2EOuO3BuVbhrSm8QpaVz71c
echo.
echo # Clerk Authentication
echo VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LWltcGFsYS0wLmNsZXJrLmFjY291bnRzLmRldiQ
) > .env

echo .env file created successfully!
echo.
echo Now run: npm run dev
pause
