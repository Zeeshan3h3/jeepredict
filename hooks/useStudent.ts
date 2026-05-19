'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase-client'

export interface StudentProfile {
  id: string
  name: string
  phone: string
  email: string | null
  marks: number | null
  category: string | null
  gender: string | null
  predicted_rank: number | null
  created_at: string
}

interface UseStudentReturn {
  student: StudentProfile | null
  loading: boolean
  refetch: () => void
}

export function useStudent(): UseStudentReturn {
  const { user, loading: authLoading } = useAuth()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStudent = useCallback(async () => {
    if (!user) {
      setStudent(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('fetchStudent error:', error)
      setStudent(null)
    } else {
      setStudent(data as StudentProfile)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!authLoading) fetchStudent()
  }, [user, authLoading, fetchStudent])

  return { student, loading, refetch: fetchStudent }
}
