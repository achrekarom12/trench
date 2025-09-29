import { FastifyInstance } from 'fastify'
import { databaseService, PaginationParams } from '../../shared/database'

export class StudentService {
  constructor(private fastify: FastifyInstance) {}

  async createStudent(studentData: {
    email: string
    name: string
    password: string
    rollNumber: string
    department: string
    year: number
    division?: string
    academicYear?: string
    prn?: string
  }) {
    try {
      // Check if roll number already exists
      const rollNumberExists = await databaseService.checkRollNumberExists(studentData.rollNumber)
      if (rollNumberExists) {
        throw new Error('Roll number already exists')
      }

      // Check if PRN already exists (if provided)
      if (studentData.prn) {
        const prnExists = await databaseService.checkPrnExists(studentData.prn)
        if (prnExists) {
          throw new Error('PRN already exists')
        }
      }

      const result = await databaseService.createStudent(studentData)
      this.fastify.log.info({ msg: `✅ Student created successfully: ${studentData.email}` })
      
      return result
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error creating student: ${error.message}`, error })
      throw error
    }
  }

  async getAllStudents(paginationParams: PaginationParams = {}) {
    try {
      const result = await databaseService.getAllStudents(paginationParams)
      this.fastify.log.info({ msg: `📋 Retrieved ${result.data.length} students` })
      
      return result
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting students: ${error.message}`, error })
      throw error
    }
  }

  async getStudentById(id: string) {
    try {
      const student = await databaseService.getStudentById(id)
      
      if (!student) {
        this.fastify.log.warn({ msg: `❌ Student not found: ${id}` })
        return null
      }

      this.fastify.log.info({ msg: `👤 Student retrieved: ${student.user.email}` })
      return student
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error getting student: ${error.message}`, error })
      throw error
    }
  }

  async updateStudent(id: string, updateData: {
    rollNumber?: string
    department?: string
    year?: number
    division?: string
    academicYear?: string
    prn?: string
  }) {
    try {
      // Check if student exists
      const existingStudent = await databaseService.getStudentById(id)
      if (!existingStudent) {
        throw new Error('Student not found')
      }

      // Check if new roll number already exists (if being updated)
      if (updateData.rollNumber && updateData.rollNumber !== existingStudent.rollNumber) {
        const rollNumberExists = await databaseService.checkRollNumberExists(updateData.rollNumber)
        if (rollNumberExists) {
          throw new Error('Roll number already exists')
        }
      }

      // Check if new PRN already exists (if being updated)
      if (updateData.prn && updateData.prn !== existingStudent.prn) {
        const prnExists = await databaseService.checkPrnExists(updateData.prn)
        if (prnExists) {
          throw new Error('PRN already exists')
        }
      }

      const updatedStudent = await databaseService.updateStudent(id, updateData)

      this.fastify.log.info({ msg: `✅ Student updated successfully: ${updatedStudent.user.email}` })
      return updatedStudent
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error updating student: ${error.message}`, error })
      throw error
    }
  }

  async deleteStudent(id: string) {
    try {
      // Check if student exists
      const existingStudent = await databaseService.getStudentById(id)
      if (!existingStudent) {
        return false
      }

      // Soft delete the user (which will cascade to student due to ON DELETE CASCADE)
      await databaseService.deleteUser(id)
      
      this.fastify.log.info({ msg: `✅ Student deleted successfully: ${existingStudent.user.email}` })
      return true
    } catch (error: any) {
      this.fastify.log.error({ msg: `❌ Error deleting student: ${error.message}`, error })
      throw error
    }
  }
}
