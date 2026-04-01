import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { projectsService } from '../services'

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    const response = await projectsService.getAll()
    return response.data
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch projects')
  }
})

export const createProject = createAsyncThunk('projects/createProject', async (project, { rejectWithValue }) => {
  try {
    const response = await projectsService.create(project)
    return response.data
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create project')
  }
})

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await projectsService.update(id, data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update project')
  }
})

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id, { rejectWithValue }) => {
  try {
    await projectsService.delete(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete project')
  }
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchProjects.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
      .addCase(createProject.fulfilled, (state, action) => { state.items.push(action.payload) })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload)
      })
  },
})

export default projectsSlice.reducer
