import { FastifyInstance } from 'fastify'
import { databaseService, PaginationParams } from '../../shared/database'

export class FacultyService {
  constructor(private fastify: FastifyInstance) {}

  async createFaculty(facultyData: {
    email: string
    name: string
    password: string
    employeeId: string
    departmentId: string
    designation?: string
    specialization?: string
  }) {
    try {
      // Check if employee ID already exists
      const employeeIdExists = await databaseService.checkEmployeeIdExists(facultyData.employeeId)
      if (employeeIdExists) {
        throw new Error('Employee ID already exists')
      }

      const result = await databaseService.createFaculty(facultyData)
      this.fastify.log.info({ msg: `✅ Faculty member created successfully: ${facultyData.email}` })
      
      return result
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error creating faculty member: ${error.message}`, error })
      throw error
    }
  }

  async getAllFaculty(paginationParams: PaginationParams = {}) {
    try {
      const result = await databaseService.getAllFaculty(paginationParams)
      this.fastify.log.info({ msg: `📋 Retrieved ${result.data.length} faculty members` })
      
      return result
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting faculty members: ${error.message}`, error })
      throw error
    }
  }

  async getFacultyById(id: string) {
    try {
      const faculty = await databaseService.getFacultyById(id)
      
      if (!faculty) {
        this.fastify.log.warn({ msg: `❌ Faculty member not found: ${id}` })
        return null
      }

      this.fastify.log.info({ msg: `👤 Faculty member retrieved: ${faculty.user.email}` })
      return faculty
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting faculty member: ${error.message}`, error })
      throw error
    }
  }

  async updateFaculty(id: string, updateData: {
    employeeId?: string
    departmentId?: string
    designation?: string
    specialization?: string
  }) {
    try {
      // Check if faculty exists
      const existingFaculty = await databaseService.getFacultyById(id)
      if (!existingFaculty) {
        throw new Error('Faculty member not found')
      }

      // Check if new employee ID already exists (if being updated)
      if (updateData.employeeId && updateData.employeeId !== existingFaculty.employeeId) {
        const employeeIdExists = await databaseService.checkEmployeeIdExists(updateData.employeeId)
        if (employeeIdExists) {
          throw new Error('Employee ID already exists')
        }
      }

      const updatedFaculty = await databaseService.updateFaculty(id, updateData)

      this.fastify.log.info({ msg: `✅ Faculty member updated successfully: ${updatedFaculty.user.email}` })
      return updatedFaculty
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error updating faculty member: ${error.message}`, error })
      throw error
    }
  }

  async deleteFaculty(id: string) {
    try {
      // Check if faculty exists
      const existingFaculty = await databaseService.getFacultyById(id)
      if (!existingFaculty) {
        return false
      }

      // Soft delete the user (which will cascade to faculty due to ON DELETE CASCADE)
      await databaseService.deleteUser(id)
      
      this.fastify.log.info({ msg: `✅ Faculty member deleted successfully: ${existingFaculty.user.email}` })
      return true
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error deleting faculty member: ${error.message}`, error })
      throw error
    }
  }
}
