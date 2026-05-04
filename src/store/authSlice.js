import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services'
import { setPermissionsFromUser, clearPermissions } from './permissionsSlice'

// Async thunk for login
export const login = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
  try {
    const response = await authService.login(username, password)
    const token = response.data.access_token
    console.log('✓ Login successful, token received:', token.substring(0, 20) + '...')
    localStorage.setItem('access_token', token)
    
    // Fetch current user details with the token (pass token directly to avoid timing issues)
    try {
      console.log('Fetching user details from /me endpoint...')
      const userResponse = await authService.getCurrentUser(token)
      const userData = userResponse.data
      console.log('✓ User details received:', userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set permissions from user data (role and permissions now come from /users/me)
      thunkAPI.dispatch(setPermissionsFromUser(userData))
      
      return { token, user: userData }
    } catch (err) {
      console.error('✗ Error fetching user details:', err)
      // If fetching user fails, return with just username and token will be stored
      return { token, user: { username } }
    }
  } catch (err) {
    console.error('✗ Login error:', err)
    return thunkAPI.rejectWithValue(err.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    authService.logout()
    // Clear permissions when logging out
    thunkAPI.dispatch(clearPermissions())
    return {}
  } catch (err) {
    return {}
  }
})

const initialState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  status: 'idle',
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error
        state.isAuthenticated = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.status = 'idle'
        state.error = null
        state.isAuthenticated = false
      })
  },
})

export default authSlice.reducer
