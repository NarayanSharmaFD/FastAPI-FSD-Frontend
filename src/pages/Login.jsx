import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { login } from '../store/authSlice'
import { useToast } from '../context/ToastContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { userLoading, error, token } = useSelector((state) => state.auth)

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim()) {
      showToast('Please enter username', 'warning')
      return
    }
    if (!password.trim()) {
      showToast('Please enter password', 'warning')
      return
    }

    try {
      await dispatch(login({ username, password })).unwrap()
      showToast('Login successful!', 'success')
      navigate('/')
    } catch (err) {
      showToast(err || 'Login failed', 'error')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                backgroundColor: '#667eea',
                borderRadius: '50%',
                p: 1.5,
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
              Task Tracker
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={userLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={userLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: 16 }}
              disabled={userLoading}
            >
              {userLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Demo Credentials:
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Admin:</strong> admin / password
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Creator:</strong> creator / password
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Viewer:</strong> viewer / password
              </Typography>
            </Box> */}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
