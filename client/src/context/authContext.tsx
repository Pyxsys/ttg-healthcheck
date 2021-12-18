import React, { createContext, useState, useEffect, useContext } from 'react'
import AuthService from '../services/authService'
import { useLocation } from 'react-router-dom'

interface AuthObject {
  isAuthenticated: boolean
  setIsAuthenticated: (active: boolean) => void
  user: UserObject
  setUser: (active: UserObject) => void
}

interface UserObject {
  name: string
  role: string
}

const AuthContext = createContext({} as AuthObject)

/**
 *
 * @return {void} user information and authentication status
 */
export function useAuth() {
  return useContext(AuthContext)
}

/**
 *
 * @param {object} param0 render from index.js
 * @return {void} auth context values
 */
export function AuthProvider({ children }: any) {
  const location = useLocation()
  const [user, setUser] = useState({ name: '', role: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  // check authentication of user on router dom changes(for links and redirects) and initial page loads
  useEffect(() => {
    AuthService.isAuthenticated().then((data: any) => {
      setUser(data.user)
      setIsAuthenticated(data.isAuthenticated)
      setLoading(false)
    })
  }, [location])

  const authContextValue = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
