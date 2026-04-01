/**
 * Redux slice for role management.
 * Handles fetching, creating, updating, and deleting roles.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import rolesService from '../services/rolesService'

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesService.getAllRoles()
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch roles')
    }
  }
)

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await rolesService.createRole(roleData)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create role')
    }
  }
)

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await rolesService.updateRole(id, data)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update role')
    }
  }
)

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await rolesService.deleteRole(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete role')
    }
  }
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

    // Create role
    builder
      .addCase(createRole.pending, (state) => {
        state.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.payload
      })

    // Update role
    builder
      .addCase(updateRole.pending, (state) => {
        state.error = null
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.error = action.payload
      })

    // Delete role
    builder
      .addCase(deleteRole.pending, (state) => {
        state.error = null
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload)
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError } = rolesSlice.actions
export default rolesSlice.reducer
