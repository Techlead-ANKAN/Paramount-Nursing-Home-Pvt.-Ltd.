import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Doctor from './pages/Doctor'
import Contact from './pages/Contact'
import RegisterBooking from './pages/RegisterBooking'
import RegistrationList from './pages/RegistrationList'
import PastRecord from './pages/PastRecord'
import AdminDashboard from './pages/AdminDashboard'
import MyBookings from './pages/MyBookings'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'
import './App.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
                       <div className="min-h-screen bg-gray-50 flex flex-col">
                 <Navbar />
                 <main className="flex-1">
                   <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/doctors" element={<Doctor />} />
              <Route path="/contact" element={<Contact />} />
                                                  <Route path="/booking" element={<RegisterBooking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/registration-list" element={<RegistrationList />} />
              <Route path="/past-records" element={<PastRecord />} />
              <Route path="/admin" element={<AdminDashboard />} />
                                   <Route path="/sign-in/*" element={<SignInPage />} />
                     <Route path="/sign-up/*" element={<SignUpPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </ClerkProvider>
  )
}

export default App