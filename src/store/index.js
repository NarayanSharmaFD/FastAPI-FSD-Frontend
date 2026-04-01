import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import usersReducer from './usersSlice'
import projectsReducer from './projectsSlice'
import tasksReducer from './tasksSlice'
import rolesReducer from './rolesSlice'
import permissionsReducer from './permissionsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
  },
})

export default store
