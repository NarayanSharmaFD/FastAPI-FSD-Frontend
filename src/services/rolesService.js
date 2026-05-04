import apiClient from './apiClient'

class RolesService {
  async getAllRoles() {
    try {
      const response = await apiClient.get('/roles/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async getRoleById(roleId) {
    try {
      const response = await apiClient.get(`/roles/${roleId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async createRole(roleData) {
    try {
      const response = await apiClient.post('/roles/', roleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async updateRole(roleId, roleData) {
    try {
      const response = await apiClient.put(`/roles/${roleId}`, roleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

  async deleteRole(roleId) {
    try {
      const response = await apiClient.delete(`/roles/${roleId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }

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
