// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react"

interface User {
  email: string
  id: number
  username: string
  following?: number[]
}

interface AuthContextType {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  initialized: boolean
  updateCurrentUser?: (updatedFields: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  initialized: false
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setInitialized(true)

  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)

    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)

    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const updateCurrentUser = (updatedFields: Partial<User>) => {
    if (!user) return
    const newUser = { ...user, ...updatedFields }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, initialized, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

