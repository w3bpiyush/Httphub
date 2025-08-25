import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
  id: string
  name: string
  orgName: string
  createdAt: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, orgName: string, password: string) => Promise<void>
  updateProfile: (name: string, orgName: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      const userData = await AsyncStorage.getItem('userData')
      
      if (token && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (name: string, password: string) => {
    try {
      const response = await fetch('http://192.168.1.70:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', data.token)
      await AsyncStorage.setItem('userData', JSON.stringify(data.user))
      
      setIsAuthenticated(true)
      setUser(data.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('userData')
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const register = async (name: string, orgName: string, password: string) => {
    try {
      const response = await fetch('http://192.168.1.70:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          orgName,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', data.token)
      await AsyncStorage.setItem('userData', JSON.stringify(data.user))
      
      setIsAuthenticated(true)
      setUser(data.user)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const updateProfile = async (name: string, orgName: string, password: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      const currentUser = user || JSON.parse((await AsyncStorage.getItem('userData')) || 'null')

      if (!token || !currentUser?.id) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('http://192.168.1.70:3000/api/auth/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: currentUser.id,
          name,
          orgName,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Update failed')
      }

      const data = await response.json()
      const updatedUser: User = data.user || { ...currentUser, name, orgName }
      const updatedToken: string | undefined = data.token

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser))
      if (updatedToken) {
        await AsyncStorage.setItem('authToken', updatedToken)
      }

      setUser(updatedUser)
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    register,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 