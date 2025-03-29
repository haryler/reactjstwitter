// src/components/PrivateRoute.tsx
import { ReactNode, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router"

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { token, initialized } = useContext(AuthContext)

  if (!initialized) {
    return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

