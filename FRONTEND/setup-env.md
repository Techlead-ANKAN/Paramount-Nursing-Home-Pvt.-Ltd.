# Environment Variables Setup

Create a `.env` file in the FRONTEND directory with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://idrgotjuuafemwedfnep.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcmdvdGp1dWFmZW13ZWRmbmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDMzOTEsImV4cCI6MjA3MTI3OTM5MX0.q-2IPOoJA1Rd0rA-F2Zi2EOuO3BuVbhrSm8QpaVz71c

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LWltcGFsYS0wLmNsZXJrLmFjY291bnRzLmRldiQ
```

## Next Steps:

1. Create the `.env` file with the above content
2. Run the database setup SQL in your Supabase dashboard
3. Start the development server
