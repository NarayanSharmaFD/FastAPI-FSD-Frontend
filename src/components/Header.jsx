import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material'
import {
  Logout,
  Home,
  FolderOpen,
  CheckCircle,
  People,
  Shield,
} from '@mui/icons-material'
import { logout } from '../store/authSlice'
import { useToast } from '../context/ToastContext'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { user } = useSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = React.useState(null)

  // Get role from user object
  const role = user?.role

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      showToast('Logged out successfully', 'success')
      navigate('/login')
    } catch (err) {
      showToast(err || 'Logout failed', 'error')
    }
    handleMenuClose()
  }

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U'
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Projects', path: '/projects', icon: FolderOpen },
    { label: 'Tasks', path: '/tasks', icon: CheckCircle },
    ...(role === 'admin' ? [
      { label: 'Users', path: '/users', icon: People },
      { label: 'Roles', path: '/roles', icon: Shield },
    ] : []),
  ]

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo/Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => navigate('/')}
          >
            📋 Task Tracker
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'center' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: isActive(item.path) ? 700 : 500,
                  borderBottom: isActive(item.path) ? '3px solid white' : 'none',
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  display: 'flex',
                  gap: 0.5,
                  alignItems: 'center',
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
                {item.label}
              </Button>
            )
          })}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Typography variant="body2" sx={{ opacity: 0.9, whiteSpace: 'nowrap' }}>
                {user.username || 'User'}
              </Typography>

              {/* User Avatar Button */}
              <Button
                onClick={handleMenuOpen}
                sx={{
                  minWidth: 'auto',
                  p: 0,
                  '&:hover': { background: 'rgba(255,255,255,0.1)' },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {getInitials(user.username)}
                </Avatar>
              </Button>

              {/* User Menu Dropdown */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Signed in as
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    Role: {role || 'N/A'}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f', display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Logout sx={{ fontSize: 18 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
