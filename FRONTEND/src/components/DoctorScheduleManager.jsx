import React, { useState, useEffect } from 'react'
import { Clock, Plus, Trash2, Save, X } from 'lucide-react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

const DoctorScheduleManager = ({ doctor, onClose, onScheduleUpdated }) => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    is_active: true
  })

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ]

  useEffect(() => {
    if (doctor) {
      fetchSchedules()
    }
  }, [doctor])

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('day_of_week')

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error('Failed to load schedules')
    }
  }

  const addSchedule = async () => {
    if (!newSchedule.start_time || !newSchedule.end_time) {
      toast.error('Please fill in all fields')
      return
    }

    if (newSchedule.start_time >= newSchedule.end_time) {
      toast.error('End time must be after start time')
      return
    }

    // Check if schedule already exists for this day
    const existingSchedule = schedules.find(s => s.day_of_week === newSchedule.day_of_week)
    if (existingSchedule) {
      toast.error('Schedule already exists for this day')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .insert([{
          doctor_id: doctor.id,
          day_of_week: newSchedule.day_of_week,
          start_time: newSchedule.start_time,
          end_time: newSchedule.end_time,
          is_active: newSchedule.is_active
        }])

      if (error) throw error

      toast.success('Schedule added successfully')
      fetchSchedules()
      setNewSchedule({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
        is_active: true
      })
    } catch (error) {
      console.error('Error adding schedule:', error)
      toast.error('Failed to add schedule')
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (scheduleId, updates) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .update(updates)
        .eq('id', scheduleId)

      if (error) throw error

      toast.success('Schedule updated successfully')
      fetchSchedules()
    } catch (error) {
      console.error('Error updating schedule:', error)
      toast.error('Failed to update schedule')
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .delete()
        .eq('id', scheduleId)

      if (error) throw error

      toast.success('Schedule deleted successfully')
      fetchSchedules()
    } catch (error) {
      console.error('Error deleting schedule:', error)
      toast.error('Failed to delete schedule')
    } finally {
      setLoading(false)
    }
  }

  const toggleScheduleStatus = async (schedule) => {
    await updateSchedule(schedule.id, { is_active: !schedule.is_active })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Manage Schedule - Dr. {doctor?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Add New Schedule */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                value={newSchedule.day_of_week}
                onChange={(e) => setNewSchedule({...newSchedule, day_of_week: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={newSchedule.start_time}
                onChange={(e) => setNewSchedule({...newSchedule, start_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={newSchedule.end_time}
                onChange={(e) => setNewSchedule({...newSchedule, end_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addSchedule}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Existing Schedules */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Current Schedules</h4>
          {schedules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No schedules found. Add a schedule above.</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-medium text-gray-900">
                        {daysOfWeek.find(d => d.value === schedule.day_of_week)?.label}
                      </span>
                      <span className="text-gray-600 ml-2">
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleScheduleStatus(schedule)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {schedule.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Schedule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorScheduleManager

