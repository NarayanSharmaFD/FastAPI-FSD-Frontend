/**
 * Roles service for API communication.
 * Handles all role-related API calls.
 */
import apiClient from './apiClient'

class RolesService {
  /**
   * Get all roles
   */
  async getAllRoles() {
    try {
      const response = await apiClient.get('/roles/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId) {
    try {
      const response = await apiClient.get(`/roles/${roleId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData) {
    try {
      const response = await apiClient.post('/roles/', roleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Update a role
   */
  async updateRole(roleId, roleData) {
    try {
      const response = await apiClient.put(`/roles/${roleId}`, roleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId) {
    try {
      const response = await apiClient.delete(`/roles/${roleId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  /**
   * Check permission for a resource and action
   */
  async checkPermission(roleId, resource, action) {
    try {
      const response = await apiClient.get(
        `/roles/${roleId}/check-permission/${resource}/${action}`
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default new RolesService()
