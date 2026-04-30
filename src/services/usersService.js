/**
 * Users service for API communication.
 * Handles all user-related API calls.
 */
import apiClient from './apiClient'

class UsersService {
  /**
   * Get all users
   */
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users/', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Update a user
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.patch(`/users/${userId}`, userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Get current user info
   */
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
