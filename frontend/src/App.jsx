import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import UserStores from './pages/UserStores.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <div>
      <Navbar />
      <div style={{maxWidth: 960, margin: '20px auto', padding: '0 16px'}}>
        <Routes>
          <Route path="/" element={<Navigate to="/stores" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stores" element={<ProtectedRoute><UserStores /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute role="OWNER"><OwnerDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
