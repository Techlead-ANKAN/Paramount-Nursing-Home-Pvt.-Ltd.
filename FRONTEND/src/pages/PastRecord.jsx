import React, { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  CalendarDays
} from 'lucide-react'
import { supabase } from '../supabase/client'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const PastRecord = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter, dateRange])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          patients (
            name,
            phone,
            email,
            age,
            gender
          ),
          doctors (
            name,
            speciality
          )
        `)
        .order('booking_date', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load past records')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.patients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.doctors?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patients?.phone?.includes(searchTerm)
      )
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.booking_date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return bookingDate >= startDate && bookingDate <= endDate
      })
    }

    setFilteredBookings(filtered)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getStatusOptions = () => {
    const statuses = [...new Set(bookings.map(booking => booking.status))]
    return statuses
  }

  const getPatientStats = () => {
    const totalBookings = bookings.length
    const completedBookings = bookings.filter(b => b.status === 'completed').length
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
    const uniquePatients = new Set(bookings.map(b => b.patient_id)).size

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      uniquePatients
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading past records...</p>
        </div>
      </div>
    )
  }

  const stats = getPatientStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Past Records</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            View patient history and past appointment records
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalBookings}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.completedBookings}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-red-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {stats.cancelledBookings}
              </div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.uniquePatients}
              </div>
              <div className="text-sm text-gray-600">Unique Patients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Status</option>
                {getStatusOptions().map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start Date"
              />
            </div>

            {/* Date Range End */}
            <div>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setDateRange({ start: '', end: '' })
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Records List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Past Records
            </h2>
            <p className="text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} records
            </p>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No records found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter || dateRange.start || dateRange.end
                  ? 'Try adjusting your search criteria.'
                  : 'No past records are currently available.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Patient Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{booking.patients?.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.patients?.age} years, {booking.patients?.gender}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.patients?.phone}
                        </div>
                        {booking.patients?.email && (
                          <div className="text-sm text-gray-600">
                            {booking.patients.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Doctor Information
                      </h3>
                      <div className="space-y-2">
                        <div className="text-gray-700 font-medium">
                          Dr. {booking.doctors?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.doctors?.speciality}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Appointment Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{booking.booking_time}</span>
                        </div>
                        <div className="mt-2">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Notes
                      </h3>
                      <div className="text-sm text-gray-600">
                        {booking.notes || 'No additional notes'}
                      </div>
                    </div>
                  </div>

                  {/* Booking Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>
                        Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy at h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Export Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Export Records
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Download patient records and appointment history for reporting and analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center">
              <FileText className="mr-2 h-5 w-5" />
              Export All Records
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors inline-flex items-center justify-center">
              <Calendar className="mr-2 h-5 w-5" />
              Export by Date Range
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PastRecord
