import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Heart, 
  Shield, 
  Clock, 
  Phone,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'
import SupabaseTest from '../components/SupabaseTest'

const Home = () => {
  const services = [
    {
      icon: Heart,
      title: 'Primary Care',
      description: 'Comprehensive health checkups and preventive care services.'
    },
    {
      icon: Shield,
      title: 'Specialized Treatment',
      description: 'Expert care in cardiology, orthopedics, and more specialties.'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock emergency medical services when you need them most.'
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Experienced healthcare professionals dedicated to your well-being.'
    }
  ]

  const stats = [
    { number: '5000+', label: 'Happy Patients' },
    { number: '50+', label: 'Expert Doctors' },
    { number: '15+', label: 'Years Experience' },
    { number: '24/7', label: 'Emergency Care' }
  ]

  const features = [
    'Online appointment booking',
    'Digital health records',
    'Expert medical consultation',
    'Modern medical equipment',
    'Comfortable patient rooms',
    'Professional nursing staff'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Experience world-class healthcare with compassionate care and cutting-edge medical technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
                <Link
                  to="/doctors"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Meet Our Doctors
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-blue-200" />
                  <h3 className="text-2xl font-semibold mb-2">Emergency Contact</h3>
                  <p className="text-blue-100 mb-4">Available 24/7 for emergencies</p>
                  <div className="flex items-center justify-center text-xl font-semibold">
                    <Phone className="mr-2 h-5 w-5" />
                    +91 98765 43210
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supabase Test Section - Temporary for debugging */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SupabaseTest />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive healthcare services to meet all your medical needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Paramount Nursing Home?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We combine medical excellence with compassionate care to provide you with the best healthcare experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Patient Testimonials
                </h3>
                <p className="text-gray-600 mb-6 italic">
                  "Excellent care and professional staff. The doctors are very knowledgeable and caring. Highly recommended!"
                </p>
                <div className="text-sm text-gray-500">
                  - Sarah Johnson, Patient
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards better health. Book your appointment with our expert doctors today.
          </p>
          <Link
            to="/booking"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
