import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import FeedPage from "./pages/FeedPage"
import ProfilePage from "./pages/ProfilePage"
import PrivateRoute from "./components/PrivateRoute"
import NotFoundPage from "./pages/NotFoundPage"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

	<Route path="/" element={
		<PrivateRoute>
			<FeedPage />
		</PrivateRoute>
	} />

	<Route path="/feed" element={
            	<PrivateRoute>
              		<FeedPage />
            	</PrivateRoute>
        } />

	<Route path="/profile" element={
            	<PrivateRoute>
              		<ProfilePage />
            	</PrivateRoute>
        } />

	<Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
