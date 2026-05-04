import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'
import { ConfirmationProvider } from './context/ConfirmationContext'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Permissions are automatically loaded from /users/me endpoint on login
  // No need for separate permissions fetch

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmationProvider>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            {isAuthenticated && <Header />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </ConfirmationProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
