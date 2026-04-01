import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import usersService from '../services/usersService'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await usersService.getAllUsers()
    return response
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch users')
  }
})

export const createUser = createAsyncThunk('users/createUser', async (user, { rejectWithValue }) => {
  try {
    const response = await usersService.createUser(user)
    return response
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create user')
  }
})

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await usersService.updateUser(id, data)
    return response
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update user')
  }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await usersService.deleteUser(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete user')
  }
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
      .addCase(createUser.fulfilled, (state, action) => { state.items.push(action.payload) })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex(u => u.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u.id !== action.payload)
      })
  },
})

export default usersSlice.reducer
