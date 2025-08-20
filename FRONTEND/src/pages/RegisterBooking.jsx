import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar, CheckCircle, Clock, User } from 'lucide-react'
import BookingForm from '../components/BookingForm'

const RegisterBooking = () => {
  const [searchParams] = useSearchParams()
  const [bookingComplete, setBookingComplete] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)

  useEffect(() => {
    const doctorId = searchParams.get('doctor')
    if (doctorId) {
      setSelectedDoctorId(doctorId)
    }
  }, [searchParams])

  const handleBookingComplete = () => {
    setBookingComplete(true)
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Appointment Booked Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been scheduled. We'll send you a confirmation email with all the details.
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Please arrive 10 minutes before your appointment time</span>
              </div>
              <div className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                <span>Bring a valid ID and insurance card if applicable</span>
              </div>
            </div>
            <button
              onClick={() => setBookingComplete(false)}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Book Your Appointment</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Schedule your appointment with our expert doctors. Quick, easy, and secure booking process.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm 
            selectedDoctorId={selectedDoctorId}
            onBookingComplete={handleBookingComplete}
          />
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What to Expect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here's what happens after you book your appointment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Confirmation</h3>
              <p className="text-gray-600">
                You'll receive a confirmation email with appointment details and instructions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Reminder</h3>
              <p className="text-gray-600">
                We'll send you a reminder 24 hours before your scheduled appointment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Consultation</h3>
              <p className="text-gray-600">
                Meet with your doctor for a comprehensive consultation and treatment plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Help?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have any questions about booking or need to reschedule, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919876543210"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              <Clock className="mr-2 h-5 w-5" />
              Call Us
            </a>
            <a
              href="mailto:info@paramountnursing.com"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors inline-flex items-center justify-center"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RegisterBooking
