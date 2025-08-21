import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Calendar, Clock, User, MapPin, Phone, Mail, FileText, CheckCircle, X, AlertCircle } from 'lucide-react'
import { supabase } from '../supabase/client'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const { user, isSignedIn } = useUser()
  const [bookings, setBookings] = useState([])
  const [cancelledBookings, setCancelledBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserBookings()
    }
  }, [isSignedIn, user])

  const fetchUserBookings = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Fetch active bookings
      const { data: activeBookings, error: activeError } = await supabase
        .from('bookings')
        .select(`
          *,
          doctors (name, speciality, experience, registration_no),
          patients (name, phone, email, age, gender)
        `)
        .eq('patients.email', user.emailAddresses[0].emailAddress)
        .order('booking_date', { ascending: false })

      if (activeError) throw activeError

      // Fetch cancelled bookings
      const { data: cancelledData, error: cancelledError } = await supabase
        .from('cancelled_bookings')
        .select(`
          *,
          doctors (name, speciality, experience, registration_no),
          patients (name, phone, email, age, gender)
        `)
        .eq('patients.email', user.emailAddresses[0].emailAddress)
        .order('booking_date', { ascending: false })

      if (cancelledError) throw cancelledError

      setBookings(activeBookings || [])
      setCancelledBookings(cancelledData || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load your bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Confirmed' },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: X, text: 'Cancelled' }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    )
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your booking history.</p>
            <a
              href="/sign-in"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  const totalBookings = bookings.length + cancelledBookings.length
  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) >= new Date()).length
  const completedBookings = bookings.filter(b => b.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your appointment history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cancelled'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelled ({cancelledBookings.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'active' && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bookings</h3>
                    <p className="text-gray-600 mb-6">You don't have any active bookings at the moment.</p>
                    <a
                      href="/booking"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book an Appointment
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onViewDetails={handleViewDetails}
                        getStatusBadge={getStatusBadge}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cancelled' && (
              <div>
                {cancelledBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <X className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Cancelled Bookings</h3>
                    <p className="text-gray-600">You don't have any cancelled bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cancelledBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onViewDetails={handleViewDetails}
                        getStatusBadge={getStatusBadge}
                        formatTime={formatTime}
                        isCancelled={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedBooking(null)
          }}
          getStatusBadge={getStatusBadge}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}

// Booking Card Component
const BookingCard = ({ booking, onViewDetails, getStatusBadge, formatTime, isCancelled = false }) => {
  const isUpcoming = new Date(booking.booking_date) >= new Date()
  const isToday = new Date(booking.booking_date).toDateString() === new Date().toDateString()

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all hover:shadow-md ${
      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dr. {booking.doctors?.name}</h3>
            <p className="text-blue-600">{booking.doctors?.speciality}</p>
            {booking.doctors?.registration_no && (
              <p className="text-sm text-gray-500">Reg: {booking.doctors.registration_no}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          {getStatusBadge(booking.status)}
          {isToday && (
            <p className="text-sm text-blue-600 font-medium mt-1">Today's Appointment</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{format(new Date(booking.booking_date), 'EEEE, MMMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(booking.booking_time)}</span>
        </div>
      </div>

      {isCancelled && booking.cancellation_reason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
          </p>
        </div>
      )}

      {booking.notes && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Notes:</strong> {booking.notes}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Paramount Nursing Home</span>
        </div>
        <button
          onClick={() => onViewDetails(booking)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <FileText className="h-4 w-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  )
}

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, onClose, getStatusBadge, formatTime }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {getStatusBadge(booking.status)}
            </div>

            {/* Doctor Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Doctor Information</h4>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Name:</strong> Dr. {booking.doctors?.name}</p>
                <p className="text-gray-700"><strong>Speciality:</strong> {booking.doctors?.speciality}</p>
                <p className="text-gray-700"><strong>Experience:</strong> {booking.doctors?.experience} years</p>
                {booking.doctors?.registration_no && (
                  <p className="text-gray-700"><strong>Registration:</strong> {booking.doctors.registration_no}</p>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Appointment Details</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-700">{format(new Date(booking.booking_date), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-700">{formatTime(booking.booking_time)}</span>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Your Information</h4>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Name:</strong> {booking.patients?.name}</p>
                <p className="text-gray-700"><strong>Age:</strong> {booking.patients?.age} years</p>
                <p className="text-gray-700"><strong>Gender:</strong> {booking.patients?.gender}</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-700">{booking.patients?.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-700">{booking.patients?.email}</span>
                </div>
              </div>
            </div>

            {/* Cancellation Reason */}
            {booking.cancellation_reason && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Cancellation Reason</h4>
                <p className="text-red-800">{booking.cancellation_reason}</p>
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}

            {/* Hospital Information */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Hospital Information</h4>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Name:</strong> Paramount Nursing Home</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-700">123 Healthcare Avenue, Medical District, City - 123456</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-700">+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyBookings

