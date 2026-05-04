import { createSlice } from '@reduxjs/toolkit'

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
    setPermissionsFromUser: (state, action) => {
      // Set permissions and role from user data (received from /users/me endpoint)
      const userData = action.payload
      if (userData?.permissions) {
        state.permissions = userData.permissions
      }
      if (userData?.role) {
        state.role = userData.role
      }
      state.status = 'idle'
      state.error = null
    },
    clearPermissions: (state) => {
      state.permissions = initialState.permissions
      state.role = initialState.role
      state.status = 'idle'
      state.error = null
    },
  },
})

export const { setPermissionsFromUser, clearPermissions } = permissionsSlice.actions
export default permissionsSlice.reducer
