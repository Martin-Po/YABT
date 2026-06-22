// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import { logger } from '../utils/logger'


import loginService from '../services/login';

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al montar, intento hidratar desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('loggedUser')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Opcional: validar expiración aquí
      setUser(parsed.user)
      loginService.setToken(parsed.token)
    }
    setLoading(false)
  }, [])

  const login = async credentials => {
    logger.debug('Login credentials:', credentials);
    
    try {
      const response = await loginService.login(credentials)
      const user = {
        username: response.username,
        name: response.name,
        role: response.role,
      }
      const token = response.token
      setUser(user)
      loginService.setToken(token)
      localStorage.setItem('loggedUser', JSON.stringify({ user, token }))      
    } catch (error) {
      logger.debug('esta dando aca error', error.data)
      logger.error('Error during login:', error)          
    }
  }

  const logout = () => {
    setUser(null)
    loginService.clearToken()
    localStorage.removeItem('loggedUser')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para consumir el contexto
export const useAuth = () => useContext(AuthContext)
