import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../services/apiClient'

// Async thunk to fetch user permissions
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/auth/permissions')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch permissions')
    }
  }
)

const initialState = {
  permissions: {
    project: { create: false, read: true, update: false, delete: false },
    task: { create: false, read: true, update: false, delete: false }
  },
  role: 'read_only',
  status: 'idle',
  error: null,
}

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissions: (state) => {
      state.permissions = initialState.permissions
      state.role = initialState.role
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = 'idle'
        state.permissions = action.payload.permissions
        state.role = action.payload.role
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload
      })
  },
})

export const { clearPermissions } = permissionsSlice.actions
export default permissionsSlice.reducer
