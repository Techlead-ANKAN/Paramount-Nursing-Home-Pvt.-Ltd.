import React, { useState, useEffect } from 'react'
import AdminAuth from '../components/AdminAuth'
import DoctorScheduleManager from '../components/DoctorScheduleManager'
import { 
  Users, 
  Calendar, 
  User, 
  MessageSquare, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Search,
  Filter,
  Download,
  Upload,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  X,
  CheckCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react'
import { supabase } from '../supabase/client'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

// Utility function for status badges
const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    confirmed: { color: 'bg-green-100 text-green-800', icon: '✅' },
    cancelled: { color: 'bg-red-100 text-red-800', icon: '❌' },
    completed: { color: 'bg-blue-100 text-blue-800', icon: '✅' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [bookings, setBookings] = useState([])
  const [contactMessages, setContactMessages] = useState([])
  const [cancelledBookings, setCancelledBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false)
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showMessageDetailsModal, setShowMessageDetailsModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState(null)

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      fetchAllData()
    }
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    fetchAllData()
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
             // Fetch all data in parallel
       const [doctorsData, patientsData, bookingsData, messagesData, cancelledBookingsData] = await Promise.all([
         supabase.from('doctors').select('*').order('name'),
         supabase.from('patients').select('*').order('name'),
         supabase.from('bookings').select(`
           *,
           patients (name, phone, email, age, gender),
           doctors (name, speciality, experience, registration_no)
         `).order('created_at', { ascending: false }),
         supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
         supabase.from('cancelled_bookings').select(`
           *,
           patients (name, phone, email, age, gender),
           doctors (name, speciality, experience, registration_no)
         `).order('created_at', { ascending: false })
       ])

             setDoctors(doctorsData.data || [])
       setPatients(patientsData.data || [])
       setBookings(bookingsData.data || [])
       setContactMessages(messagesData.data || [])
       setCancelledBookings(cancelledBookingsData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const getStats = () => {
    const totalDoctors = doctors.length
    const totalPatients = patients.length
    const totalBookings = bookings.length
    const pendingBookings = bookings.filter(b => b.status === 'pending').length
    const completedBookings = bookings.filter(b => b.status === 'completed').length
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
    const totalMessages = contactMessages.length
    const unreadMessages = contactMessages.filter(m => !m.read).length

    return {
      totalDoctors,
      totalPatients,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalMessages,
      unreadMessages
    }
  }

  const handleAddDoctor = async (doctorData) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .insert([doctorData])

      if (error) throw error

      toast.success('Doctor added successfully!')
      setShowAddDoctorModal(false)
      fetchAllData()
    } catch (error) {
      console.error('Error adding doctor:', error)
      toast.error('Failed to add doctor')
    }
  }

  const handleEditDoctor = async (id, doctorData) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update(doctorData)
        .eq('id', id)

      if (error) throw error

      toast.success('Doctor updated successfully!')
      setShowEditDoctorModal(false)
      setSelectedDoctor(null)
      fetchAllData()
    } catch (error) {
      console.error('Error updating doctor:', error)
      toast.error('Failed to update doctor')
    }
  }

  const handleDeleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return

    try {
      // Check if doctor has any bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('doctor_id', id)

      if (bookings && bookings.length > 0) {
        toast.error('Cannot delete doctor with existing bookings. Please cancel all bookings first.')
        return
      }

      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Doctor deleted successfully!')
      fetchAllData()
    } catch (error) {
      console.error('Error deleting doctor:', error)
      toast.error('Failed to delete doctor')
    }
  }

  const handleManageSchedule = (doctor) => {
    setSelectedDoctorForSchedule(doctor)
    setShowScheduleModal(true)
  }

  const handleScheduleUpdated = () => {
    fetchAllData()
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      toast.success(`Booking status updated to ${newStatus}`)
      fetchAllData()
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast.error('Failed to update booking status')
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId)

      if (error) throw error

      toast.success('Message marked as read')
      fetchAllData()
    } catch (error) {
      console.error('Error marking message as read:', error)
      toast.error('Failed to mark message as read')
    }
  }

  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error

      toast.success('Message deleted successfully')
      fetchAllData()
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  const exportData = async (type) => {
    try {
      let data = []
      let filename = ''

             switch (type) {
         case 'doctors':
           data = doctors
           filename = 'doctors.csv'
           break
         case 'patients':
           data = patients
           filename = 'patients.csv'
           break
         case 'bookings':
           data = bookings
           filename = 'bookings.csv'
           break
         case 'cancelled_bookings':
           data = cancelledBookings
           filename = 'cancelled_bookings.csv'
           break
         case 'messages':
           data = contactMessages
           filename = 'messages.csv'
           break
         default:
           return
       }

      // Convert to CSV
      const headers = Object.keys(data[0] || {}).join(',')
      const csvContent = [headers, ...data.map(row => Object.values(row).join(','))].join('\n')
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)

      toast.success(`${type} data exported successfully`)
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  const stats = getStats()

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your OPD website</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                System Status: <span className="text-green-600 ml-1">Online</span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated')
                  setIsAuthenticated(false)
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
                             {[
                 { id: 'overview', name: 'Overview', icon: BarChart3 },
                 { id: 'doctors', name: 'Doctors', icon: Users },
                 { id: 'patients', name: 'Patients', icon: User },
                 { id: 'bookings', name: 'Bookings', icon: Calendar },
                 { id: 'cancelled', name: 'Cancelled', icon: X },
                 { id: 'messages', name: 'Messages', icon: MessageSquare },
                 { id: 'settings', name: 'Settings', icon: Settings }
               ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} bookings={bookings} />
            )}
                         {activeTab === 'doctors' && (
               <DoctorsTab 
                 doctors={doctors} 
                 onAddDoctor={handleAddDoctor}
                 onEditDoctor={handleEditDoctor}
                 onDeleteDoctor={handleDeleteDoctor}
                 onManageSchedule={handleManageSchedule}
                 showAddModal={showAddDoctorModal}
                 setShowAddModal={setShowAddDoctorModal}
                 showEditModal={showEditDoctorModal}
                 setShowEditModal={setShowEditDoctorModal}
                 selectedDoctor={selectedDoctor}
                 setSelectedDoctor={setSelectedDoctor}
                 onExport={() => exportData('doctors')}
               />
             )}
            {activeTab === 'patients' && (
              <PatientsTab 
                patients={patients} 
                onExport={() => exportData('patients')}
              />
            )}
                         {activeTab === 'bookings' && (
               <BookingsTab 
                 bookings={bookings} 
                 onUpdateStatus={updateBookingStatus}
                 onExport={() => exportData('bookings')}
                 showDetailsModal={showBookingDetailsModal}
                 setShowDetailsModal={setShowBookingDetailsModal}
                 selectedBooking={selectedBooking}
                 setSelectedBooking={setSelectedBooking}
               />
             )}
             {activeTab === 'cancelled' && (
               <CancelledBookingsTab 
                 cancelledBookings={cancelledBookings} 
                 onExport={() => exportData('cancelled_bookings')}
                 showDetailsModal={showBookingDetailsModal}
                 setShowDetailsModal={setShowBookingDetailsModal}
                 selectedBooking={selectedBooking}
                 setSelectedBooking={setSelectedBooking}
               />
             )}
             {activeTab === 'messages' && (
              <MessagesTab 
                messages={contactMessages}
                onMarkAsRead={markMessageAsRead}
                onDelete={deleteMessage}
                onExport={() => exportData('messages')}
                showDetailsModal={showMessageDetailsModal}
                setShowDetailsModal={setShowMessageDetailsModal}
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        </div>
      </div>

      {/* Schedule Manager Modal */}
      {showScheduleModal && selectedDoctorForSchedule && (
        <DoctorScheduleManager
          doctor={selectedDoctorForSchedule}
          onClose={() => {
            setShowScheduleModal(false)
            setSelectedDoctorForSchedule(null)
          }}
          onScheduleUpdated={handleScheduleUpdated}
        />
      )}
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ stats, bookings }) => {
  const recentBookings = bookings.slice(0, 5)
  const pendingBookings = bookings.filter(b => b.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.patients?.name}</p>
                  <p className="text-sm text-gray-600">Dr. {booking.doctors?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{format(new Date(booking.booking_date), 'MMM dd')}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Bookings</span>
              <span className="font-semibold text-yellow-600">{stats.pendingBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Bookings</span>
              <span className="font-semibold text-green-600">{stats.completedBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled Bookings</span>
              <span className="font-semibold text-red-600">{stats.cancelledBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unread Messages</span>
              <span className="font-semibold text-orange-600">{stats.unreadMessages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Doctor Schedule Display Component
const DoctorScheduleDisplay = ({ doctorId }) => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [doctorId])

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('is_active', true)
        .order('day_of_week')

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (dayNumber) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[dayNumber]
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return <div className="text-xs text-gray-500">Loading...</div>
  }

  if (schedules.length === 0) {
    return <div className="text-xs text-gray-500">No schedule set</div>
  }

  return (
    <div className="text-xs">
      {schedules.slice(0, 2).map((schedule) => (
        <div key={schedule.id} className="text-gray-600">
          {getDayName(schedule.day_of_week)}: {formatTime(schedule.start_time)}-{formatTime(schedule.end_time)}
        </div>
      ))}
      {schedules.length > 2 && (
        <div className="text-gray-500">+{schedules.length - 2} more</div>
      )}
    </div>
  )
}

// Doctors Tab Component
const DoctorsTab = ({ 
  doctors, 
  onAddDoctor, 
  onEditDoctor, 
  onDeleteDoctor,
  onManageSchedule,
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  selectedDoctor,
  setSelectedDoctor,
  onExport
}) => {
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    experience: '',
    registration_no: '',
    image_url: ''
  })
  const [scheduleData, setScheduleData] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (showEditModal && selectedDoctor) {
      onEditDoctor(selectedDoctor.id, formData)
    } else {
      onAddDoctor(formData)
    }
    setFormData({ name: '', speciality: '', experience: '', registration_no: '', image_url: '' })
  }

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      name: doctor.name,
      speciality: doctor.speciality,
      experience: doctor.experience.toString(),
      registration_no: doctor.registration_no || '',
      image_url: doctor.image_url || ''
    })
    setShowEditModal(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Manage Doctors</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </button>
          <button
            onClick={onExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Speciality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Registration
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Schedule
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Actions
               </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.speciality}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.experience} years</div>
                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{doctor.registration_no || 'N/A'}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <DoctorScheduleDisplay doctorId={doctor.id} />
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit Doctor"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onManageSchedule(doctor)}
                      className="text-green-600 hover:text-green-900"
                      title="Manage Schedule"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Doctor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Doctor Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showEditModal ? 'Edit Doctor' : 'Add New Doctor'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Speciality</label>
                  <input
                    type="text"
                    value={formData.speciality}
                    onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registration_no}
                    onChange={(e) => setFormData({...formData, registration_no: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., REG-12345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/doctor-image.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setFormData({ name: '', speciality: '', experience: '', registration_no: '', image_url: '' })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    {showEditModal ? 'Update' : 'Add'} Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Patients Tab Component
const PatientsTab = ({ patients, onExport }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age & Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.age} years, {patient.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.phone}</div>
                  {patient.email && <div className="text-sm text-gray-500">{patient.email}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(patient.created_at), 'MMM dd, yyyy')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Bookings Tab Component
const BookingsTab = ({ bookings, onUpdateStatus, onExport, showDetailsModal, setShowDetailsModal, selectedBooking, setSelectedBooking }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.patients?.name}</div>
                    <div className="text-sm text-gray-500">{booking.patients?.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Dr. {booking.doctors?.name}</div>
                    <div className="text-sm text-gray-500">{booking.doctors?.speciality}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">{booking.booking_time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                          title="Confirm Booking"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel Booking"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => onUpdateStatus(booking.id, 'completed')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowDetailsModal(true)
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient:</p>
                  <p className="text-gray-900">{selectedBooking.patients?.name}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.patients?.phone}</p>
                  {selectedBooking.patients?.email && (
                    <p className="text-sm text-gray-500">{selectedBooking.patients?.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Doctor:</p>
                  <p className="text-gray-900">Dr. {selectedBooking.doctors?.name}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.doctors?.speciality}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date & Time:</p>
                  <p className="text-gray-900">
                    {format(new Date(selectedBooking.booking_date), 'MMM dd, yyyy')}
                    <span className="ml-2 text-gray-500">at {selectedBooking.booking_time}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status:</p>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="text-gray-900">{selectedBooking.notes || 'No notes provided.'}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
     )
 }

 // Cancelled Bookings Tab Component
 const CancelledBookingsTab = ({ cancelledBookings, onExport, showDetailsModal, setShowDetailsModal, selectedBooking, setSelectedBooking }) => {
   return (
     <div>
       <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-semibold text-gray-900">Cancelled Bookings</h3>
         <div className="flex space-x-2">
           <button
             onClick={onExport}
             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
           >
             <Download className="h-4 w-4 mr-2" />
             Export
           </button>
         </div>
       </div>

       <div className="bg-white rounded-lg shadow overflow-hidden">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Patient
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Doctor
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Date & Time
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Cancellation Reason
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Actions
               </th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {cancelledBookings.map((booking) => (
               <tr key={booking.id}>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-900">{booking.patients?.name}</div>
                     <div className="text-sm text-gray-500">{booking.patients?.phone}</div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-900">Dr. {booking.doctors?.name}</div>
                     <div className="text-sm text-gray-500">{booking.doctors?.speciality}</div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-900">
                       {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                     </div>
                     <div className="text-sm text-gray-500">{booking.booking_time}</div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{booking.cancellation_reason || 'No reason provided'}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <div className="flex space-x-2">
                     <button
                       onClick={() => {
                         setSelectedBooking(booking)
                         setShowDetailsModal(true)
                       }}
                       className="text-purple-600 hover:text-purple-900"
                       title="View Details"
                     >
                       <Eye className="h-4 w-4" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       {cancelledBookings.length === 0 && (
         <div className="text-center py-8">
           <p className="text-gray-500">No cancelled bookings found.</p>
         </div>
       )}
     </div>
   )
 }

 // Messages Tab Component
const MessagesTab = ({ messages, onMarkAsRead, onDelete, onExport, showDetailsModal, setShowDetailsModal, selectedMessage, setSelectedMessage }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Contact Messages</h3>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`bg-white rounded-lg shadow p-6 ${!message.read ? 'border-l-4 border-blue-500' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{message.name}</h4>
                  <span className="text-sm text-gray-500">
                    {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{message.email}</p>
                <p className="text-gray-700">{message.message}</p>
              </div>
              <div className="ml-4 flex space-x-2">
                {!message.read && (
                  <button
                    onClick={() => onMarkAsRead(message.id)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                    title="Mark as Read"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedMessage(message)
                    setShowDetailsModal(true)
                  }}
                  className="text-purple-600 hover:text-purple-900 text-sm"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                  title="Delete Message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Details Modal */}
      {showDetailsModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Message Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name:</p>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email:</p>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Message:</p>
                  <p className="text-gray-900">{selectedMessage.message}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Created At:</p>
                  <p className="text-gray-900">
                    {format(new Date(selectedMessage.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Read:</p>
                  <p className="text-gray-900">
                    {selectedMessage.read ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// Settings Tab Component
const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
              <input
                type="text"
                defaultValue="Paramount Nursing Home"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                defaultValue="info@paramountnursing.com"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                rows="3"
                defaultValue="123 Healthcare Avenue, Medical District, City - 123456"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
