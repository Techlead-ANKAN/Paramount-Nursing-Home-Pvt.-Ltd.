import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

const SupabaseTest = () => {
  const [testResult, setTestResult] = useState('Testing...')
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      
      // Test basic connection
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .limit(5)

      if (error) {
        console.error('Connection test failed:', error)
        setTestResult(`Error: ${error.message}`)
        return
      }

      console.log('Connection successful! Data:', data)
      setTestResult(`Success! Found ${data?.length || 0} doctors`)
      setDoctors(data || [])
    } catch (error) {
      console.error('Test failed:', error)
      setTestResult(`Failed: ${error.message}`)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Supabase Connection Test</h3>
      <p className="mb-4">{testResult}</p>
      
      {doctors.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Doctors in Database:</h4>
          <ul className="space-y-1">
            {doctors.map((doctor) => (
              <li key={doctor.id} className="text-sm">
                {doctor.name} - {doctor.speciality}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        onClick={testSupabaseConnection}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Again
      </button>
    </div>
  )
}

export default SupabaseTest
