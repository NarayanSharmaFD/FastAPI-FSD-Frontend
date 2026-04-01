import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tasksService } from '../services'

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await tasksService.getAll()
    return response.data
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch tasks')
  }
})

export const createTask = createAsyncThunk('tasks/createTask', async (task, { rejectWithValue }) => {
  try {
    const response = await tasksService.create(task)
    return response.data
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create task')
  }
})

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await tasksService.update(id, data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update task')
  }
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await tasksService.delete(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete task')
  }
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchTasks.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
      .addCase(createTask.fulfilled, (state, action) => { state.items.push(action.payload) })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  },
})

export default tasksSlice.reducer
