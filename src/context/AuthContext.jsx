import { createContext, useContext, useState, useEffect } from 'react'
import { googleAuth } from '../services/googleAuth.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (googleAuth.isAuthenticated()) {
          setIsAuthenticated(true)
          
          // Obtener información real del usuario de Google
          const cachedUser = googleAuth.getCachedUserInfo()
          
          if (cachedUser) {
            setUser(cachedUser)
          } else {
            // Si no hay cache, obtener del servidor
            const userInfo = await googleAuth.getUserInfo()
            setUser(userInfo)
          }
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error('❌ AuthContext - Error checking auth status:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = () => {
    setLoading(true)
    googleAuth.login()
  }

  const logout = () => {
    googleAuth.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  // Función para refrescar el estado de autenticación
  const refreshAuthStatus = async () => {
    try {
      setLoading(true)
      if (googleAuth.isAuthenticated()) {
        setIsAuthenticated(true)
        
        // Obtener información real del usuario de Google
        const cachedUser = googleAuth.getCachedUserInfo()
        if (cachedUser) {
          setUser(cachedUser)
        } else {
          // Si no hay cache, obtener del servidor
          const userInfo = await googleAuth.getUserInfo()
          setUser(userInfo)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing auth status:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar la información del usuario
  const updateUserInfo = async () => {
    try {
      if (isAuthenticated) {
        const userInfo = await googleAuth.getUserInfo()
        setUser(userInfo)
      }
    } catch (error) {
      console.error('Error updating user info:', error)
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshAuthStatus,
    updateUserInfo
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}