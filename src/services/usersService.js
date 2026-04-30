import apiClient from './apiClient'

class UsersService {
  
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async createUser(userData) {
    try {
      const response = await apiClient.post('/users/', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await apiClient.patch(`/users/${userId}`, userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/users/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default new UsersService()
