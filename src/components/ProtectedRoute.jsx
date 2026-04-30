import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Typography, Button } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'

/**
 * ProtectedRoute Component
 * Protects routes based on:
 * 1. Authentication (token exists)
 * 2. User role (admin, task_creator, read_only)
 * 
 * Usage:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * Roles:
 * - admin: Full access to all features
 * - task_creator: Can create/edit tasks and projects, manage own data
 * - read_only: Can only view data
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { token, user } = useSelector((state) => state.auth)
  const role = user?.role

  // Not authenticated - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  console.log('ProtectedRoute - requiredRole:', requiredRole, 'userRole:', role)
  // Authenticated but specific role required
  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <LockIcon sx={{ fontSize: 80, color: '#999', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          You don't have permission to access this page. Your role: <strong>{role}</strong>
          {requiredRole && <> (Required: {requiredRole})</>}
        </Typography>
        <Button variant="contained" href="/">
          Go to Dashboard
        </Button>
      </Box>
    )
  }

  // All checks passed - render protected content
  return children
}

export default ProtectedRoute
