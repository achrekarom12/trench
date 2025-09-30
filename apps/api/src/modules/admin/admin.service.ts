import { FastifyInstance } from 'fastify'
import { databaseService, PaginationParams } from '../../shared/database'

export class AdminService {
  constructor(private fastify: FastifyInstance) {}

  async createAdmin(adminData: {
    email: string
    name: string
    password: string
    departmentId: string
  }) {
    try {
      const result = await databaseService.createAdmin(adminData)
      this.fastify.log.info({ msg: `✅ Admin created successfully: ${adminData.email}` })
      
      return result
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error creating admin: ${error.message}`, error })
      throw error
    }
  }

  async getAllAdmins(paginationParams: PaginationParams = {}) {
    try {
      const result = await databaseService.getAllAdmins(paginationParams)
      this.fastify.log.info({ msg: `📋 Retrieved ${result.data.length} admins` })
      
      return result
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting admins: ${error.message}`, error })
      throw error
    }
  }

  async getAdminById(id: string) {
    try {
      const admin = await databaseService.getAdminById(id)
      
      if (!admin) {
        this.fastify.log.warn({ msg: `❌ Admin not found: ${id}` })
        return null
      }

      this.fastify.log.info({ msg: `👤 Admin retrieved: ${admin.user.email}` })
      return admin
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting admin: ${error.message}`, error })
      throw error
    }
  }

  async updateAdmin(id: string, updateData: {
    departmentId?: string
  }) {
    try {
      // Check if admin exists
      const existingAdmin = await databaseService.getAdminById(id)
      if (!existingAdmin) {
        throw new Error('Admin not found')
      }

      const updatedAdmin = await databaseService.updateAdmin(id, updateData)

      this.fastify.log.info({ msg: `✅ Admin updated successfully: ${updatedAdmin.user.email}` })
      return updatedAdmin
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error updating admin: ${error.message}`, error })
      throw error
    }
  }

  async deleteAdmin(id: string) {
    try {
      // Check if admin exists
      const existingAdmin = await databaseService.getAdminById(id)
      if (!existingAdmin) {
        return false
      }

      // Soft delete the user (which will cascade to admin due to ON DELETE CASCADE)
      await databaseService.deleteUser(id)
      
      this.fastify.log.info({ msg: `✅ Admin deleted successfully: ${existingAdmin.user.email}` })
      return true
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error deleting admin: ${error.message}`, error })
      throw error
    }
  }

  async getDashboardStats() {
    try {
      const stats = await databaseService.getDashboardStats()
      this.fastify.log.info({ msg: `📊 Dashboard stats retrieved successfully` })
      
      return stats
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting dashboard stats: ${error.message}`, error })
      throw error
    }
  }
}
