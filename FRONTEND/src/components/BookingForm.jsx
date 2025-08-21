import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, User, Phone, Mail, MapPin } from 'lucide-react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

const BookingForm = ({ selectedDoctorId, onBookingComplete }) => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm()

  const watchDoctorId = watch('doctor_id')
  const watchBookingDate = watch('booking_date')

  useEffect(() => {
    fetchDoctors()
    fetchTimeSlots() // Fetch all possible time slots once
  }, [])

  useEffect(() => {
    if (selectedDoctorId) {
      setSelectedDoctor(selectedDoctorId)
    }
  }, [selectedDoctorId])

  useEffect(() => {
    if (watchDoctorId) {
      const doctor = doctors.find(d => d.id === watchDoctorId)
      setSelectedDoctor(doctor)
    }
  }, [watchDoctorId, doctors])

  useEffect(() => {
    if (watchDoctorId && watchBookingDate) {
      fetchAvailableSlots(watchDoctorId, watchBookingDate)
    } else {
      setAvailableSlots([])
    }
  }, [watchDoctorId, watchBookingDate])

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name')

      if (error) throw error
      setDoctors(data || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast.error('Failed to load doctors')
    }
  }

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_active', true)
        .order('slot_time')

      if (error) throw error
      setTimeSlots(data || [])
    } catch (error) {
      console.error('Error fetching time slots:', error)
    }
  }

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      // Get doctor's schedule for the selected day
      const dayOfWeek = new Date(date).getDay()

      const { data: scheduleData, error: scheduleError } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .single()

      if (scheduleError || !scheduleData) {
        setAvailableSlots([])
        return
      }

      // Get booked slots for this doctor on this date
      const { data: bookedSlots, error: bookedError } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('doctor_id', doctorId)
        .eq('booking_date', date)

      if (bookedError) throw bookedError

      const bookedTimes = bookedSlots.map(slot => slot.booking_time)

      // Filter time slots that are within doctor's schedule and not booked
      const available = timeSlots.filter(slot => {
        const slotTime = slot.slot_time
        const isWithinSchedule = slotTime >= scheduleData.start_time && slotTime <= scheduleData.end_time
        const isNotBooked = !bookedTimes.includes(slotTime)
        return isWithinSchedule && isNotBooked
      })

      setAvailableSlots(available)
    } catch (error) {
      console.error('Error fetching available slots:', error)
      setAvailableSlots([])
    }
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // First, create or get patient record
      let patientId = data.patient_id

      if (!patientId) {
        // Create new patient
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .insert([
            {
              name: data.patient_name,
              age: parseInt(data.age),
              gender: data.gender,
              phone: data.phone,
              email: data.email
            }
          ])
          .select()

        if (patientError) throw patientError
        patientId = patientData[0].id
      }

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            patient_id: patientId,
            doctor_id: data.doctor_id,
            booking_date: data.booking_date,
            booking_time: data.booking_time,
            notes: data.notes || '',
            status: 'pending'
          }
        ])

      if (bookingError) throw bookingError

      toast.success('Appointment booked successfully!')
      reset()
      if (onBookingComplete) {
        onBookingComplete()
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Appointment</h2>
        <p className="text-gray-600">Fill in your details to schedule an appointment with our expert doctors.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Select Doctor
          </label>
          <select
            {...register('doctor_id', { required: 'Please select a doctor' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.speciality}
                {doctor.registration_no && ` (Reg: ${doctor.registration_no})`}
              </option>
            ))}
          </select>
          {errors.doctor_id && (
            <p className="text-red-600 text-sm mt-1">{errors.doctor_id.message}</p>
          )}
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register('patient_name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {errors.patient_name && (
              <p className="text-red-600 text-sm mt-1">{errors.patient_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              {...register('age', { 
                required: 'Age is required',
                min: { value: 1, message: 'Age must be at least 1' },
                max: { value: 120, message: 'Age must be less than 120' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              {...register('gender', { required: 'Please select gender' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: { 
                  value: /^[0-9+\-\s()]+$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address
            </label>
            <input
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address (optional)"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Preferred Date *
            </label>
            <input
              type="date"
              {...register('booking_date', { required: 'Please select a date' })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.booking_date && (
              <p className="text-red-600 text-sm mt-1">{errors.booking_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Preferred Time *
            </label>
            <select
              {...register('booking_time', { required: 'Please select a time' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!watchDoctorId || !watchBookingDate || availableSlots.length === 0}
            >
              <option value="">
                {!watchDoctorId ? 'Select a doctor first' :
                 !watchBookingDate ? 'Select a date first' :
                 availableSlots.length === 0 ? 'No available slots' : 'Select time...'}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.slot_time}>
                  {formatTime(slot.slot_time)}
                </option>
              ))}
            </select>
            {errors.booking_time && (
              <p className="text-red-600 text-sm mt-1">{errors.booking_time.message}</p>
            )}
            {watchDoctorId && watchBookingDate && availableSlots.length === 0 && (
              <p className="text-orange-600 text-sm mt-1">
                No available slots for this date. Please select another date.
              </p>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any specific concerns or information you'd like to share..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Booking Appointment...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </>
          )}
        </button>
      </form>

      {/* Doctor Info */}
      {selectedDoctor && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Doctor</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Dr. {selectedDoctor.name}</p>
              <p className="text-blue-600">{selectedDoctor.speciality}</p>
              <p className="text-sm text-gray-600">{selectedDoctor.experience} years experience</p>
              {selectedDoctor.registration_no && (
                <p className="text-sm text-gray-500">Registration: {selectedDoctor.registration_no}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingForm
