import apiClient from './apiClient'
import axios from 'axios'

// AUTH SERVICE
export const authService = {
  login: (username, password) =>
    apiClient.post('/auth/token', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),

  register: (userData) =>
    apiClient.post('/users/', userData),

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  },

  getCurrentUser: (token) => {
    if (token) {
      return axios.get(
        `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    }
    // Otherwise use apiClient which reads token from localStorage
    return apiClient.get('/users/me')
  },
}

// USERS SERVICE
export const usersService = {
  getAll: (skip = 0, limit = 100) =>
    apiClient.get('/users/', { params: { skip, limit } }),

  getById: (id) =>
    apiClient.get(`/users/${id}`),

  create: (userData) =>
    apiClient.post('/users/', userData),

  update: (id, userData) =>
    apiClient.patch(`/users/${id}`, userData),

  delete: (id) =>
    apiClient.delete(`/users/${id}`),
}

// PROJECTS SERVICE
export const projectsService = {
  getAll: (skip = 0, limit = 100) =>
    apiClient.get('/projects/', { params: { skip, limit } }),

  getById: (id) =>
    apiClient.get(`/projects/${id}`),

  create: (projectData) =>
    apiClient.post('/projects/', projectData),

  update: (id, projectData) =>
    apiClient.patch(`/projects/${id}`, projectData),

  delete: (id) =>
    apiClient.delete(`/projects/${id}`),
}

// TASKS SERVICE
export const tasksService = {
  getAll: (skip = 0, limit = 100) =>
    apiClient.get('/tasks/', { params: { skip, limit } }),

  getById: (id) =>
    apiClient.get(`/tasks/${id}`),

  create: (taskData) =>
    apiClient.post('/tasks/', taskData),

  update: (id, taskData) =>
    apiClient.patch(`/tasks/${id}`, taskData),

  delete: (id) =>
    apiClient.delete(`/tasks/${id}`),

  getByProject: (projectId) =>
    apiClient.get('/tasks/', { params: { project_id: projectId } }),
}
