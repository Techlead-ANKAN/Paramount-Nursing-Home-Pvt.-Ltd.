# 🏥 Paramount Nursing Home - OPD Website

A modern, responsive web application for managing doctor appointments, patient registrations, and healthcare services. Built with React, Supabase, and Clerk authentication.

## ✨ Features

### 🏠 **Home Page**
- Professional landing page with hospital information
- Quick navigation to all major sections
- Service highlights and statistics
- Call-to-action buttons for booking appointments

### 👨‍⚕️ **Doctors List**
- Comprehensive list of available doctors
- Search and filter by specialty
- Doctor profiles with experience and consultation timings
- Direct booking links for each doctor

### 📅 **Appointment Booking**
- User-friendly booking form
- Patient registration and information collection
- Doctor selection with availability
- Date and time slot selection
- Booking confirmation and status tracking

### 📋 **Registration Management**
- Admin/Doctor view of all appointments
- Real-time status updates (Pending, Confirmed, Completed, Cancelled)
- Search and filter functionality
- Patient and doctor information display

### 📊 **Past Records**
- Complete patient history
- Appointment tracking and analytics
- Export functionality for records
- Advanced filtering and search

### 📞 **Contact & Support**
- Contact form with message submission
- Hospital information and location
- Emergency contact details
- FAQ section

### 🔐 **Authentication**
- Secure user authentication with Clerk
- User registration and login
- Protected routes and admin access

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **Authentication**: Clerk
- **UI Components**: Lucide React Icons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd paramount-nursing-home
```

### 2. Install Dependencies
```bash
cd FRONTEND
npm install
```

### 3. Environment Setup

Create a `.env` file in the `FRONTEND` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Setup

### Supabase Tables

Run these SQL commands in your Supabase SQL editor:

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

### Sample Data

Insert some sample doctors:

```sql
INSERT INTO doctors (name, specialty, experience, consultation_timings) VALUES
('Dr. Sarah Johnson', 'Cardiology', 15, 'Mon-Fri: 9:00 AM - 5:00 PM'),
('Dr. Michael Chen', 'Orthopedics', 12, 'Mon-Sat: 8:00 AM - 6:00 PM'),
('Dr. Emily Davis', 'Pediatrics', 10, 'Mon-Fri: 10:00 AM - 4:00 PM'),
('Dr. Robert Wilson', 'Neurology', 18, 'Tue-Sat: 9:00 AM - 5:00 PM'),
('Dr. Lisa Brown', 'Gynecology', 14, 'Mon-Fri: 8:00 AM - 6:00 PM');
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env` file

### Clerk Setup
1. Create a new application at [clerk.com](https://clerk.com)
2. Get your publishable key from the dashboard
3. Add it to your `.env` file
4. Configure authentication methods (email/password, social logins)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop computers (1024px+)
- 🖥️ Large screens (1280px+)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional healthcare-themed interface
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: User-friendly error messages and validation
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Comprehensive client-side validation
- **Search & Filter**: Advanced filtering capabilities across all lists

## 🔒 Security Features

- **Authentication**: Secure user authentication with Clerk
- **Data Validation**: Server-side and client-side validation
- **SQL Injection Protection**: Parameterized queries with Supabase
- **CORS Protection**: Proper CORS configuration
- **Environment Variables**: Secure configuration management

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized images and icons
- **Caching**: Efficient data caching strategies
- **Bundle Optimization**: Minimal bundle size with tree shaking

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@paramountnursing.com
- 📞 Phone: +91 98765 43210
- 🌐 Website: [paramountnursing.com](https://paramountnursing.com)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Clerk](https://clerk.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icons
- [Vite](https://vitejs.dev/) - Build tool

---

**Made with ❤️ for better healthcare**
