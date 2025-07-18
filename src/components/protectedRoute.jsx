// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Fetch user profile to get role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setUser(user)
        setUserRole(profile?.role)
      }
      
      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role check
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/user-dashboard" replace />
  }

  return children
}