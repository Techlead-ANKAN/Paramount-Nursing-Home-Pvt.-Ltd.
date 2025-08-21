import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Star, User, FileText } from 'lucide-react'
import { supabase } from '../supabase/client'

const DoctorCard = ({ doctor }) => {
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    fetchDoctorSchedule()
  }, [doctor.id])

  const fetchDoctorSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctor.id)
        .eq('is_active', true)
        .order('day_of_week')

      if (error) throw error
      setSchedule(data || [])
    } catch (error) {
      console.error('Error fetching doctor schedule:', error)
    }
  }

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.speciality}</p>
            {doctor.registration_no && (
              <p className="text-sm text-gray-500 mt-1">
                <FileText className="w-3 h-3 inline mr-1" />
                Reg: {doctor.registration_no}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 ml-1">4.8</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{doctor.experience} years experience</span>
        </div>
        {schedule.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Available Days:</p>
            <div className="space-y-1">
              {schedule.map((sched) => (
                <div key={sched.id} className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {getDayName(sched.day_of_week)}: {formatTime(sched.start_time)} - {formatTime(sched.end_time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Link
        to={`/booking?doctor=${doctor.id}`}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Slot
      </Link>
    </div>
  )
}

export default DoctorCard
