import { FastifyInstance } from 'fastify'
import { User, UserProfile, UpdateUserInput } from './user.types'
import { AuthService } from '../../auth/auth.service'
import { databaseService } from '../../shared/database'

export class UserService {
  private authService: AuthService

  constructor(private fastify: FastifyInstance) {
    this.authService = new AuthService(fastify)
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.authService.getUserById(userId)
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      isDeleted: user.isDeleted,
      deletedAt: user.deletedAt || undefined
    }
  }

  async updateUserProfile(userId: string, input: UpdateUserInput): Promise<UserProfile | null> {
    const user = await databaseService.findUserById(userId)
    
    if (!user) return null

    // Check if email is already taken by another user (if email is being updated)
    if (input.email !== undefined && input.email !== user.email) {
      const existingUser = await databaseService.findUserByEmail(input.email)
      if (existingUser) {
        throw new Error('Email is already taken')
      }
    }

    // Update the user in database
    const updatedUser = await databaseService.updateUser(userId, {
      name: input.name,
      email: input.email,
    })

    this.fastify.log.info({ msg: `✅ User ${updatedUser.email} profile updated successfully` })

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      isDeleted: updatedUser.isDeleted,
      deletedAt: updatedUser.deletedAt || undefined
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    this.fastify.log.info({ msg: `🔍 Attempting to soft delete user with ID: ${userId}` })
    
    const user = await databaseService.findUserById(userId)
    
    if (!user) {
      this.fastify.log.warn({ msg: `❌ User not found with ID: ${userId}` })
      return false
    }

    this.fastify.log.info({ msg: `👤 Found user: ${user.email}` })

    // Soft delete the user from database
    await databaseService.deleteUser(userId)
    
    this.fastify.log.info({ msg: `✅ User ${user.email} soft deleted successfully` })
    
    return true
  }

  async restoreUser(userId: string): Promise<boolean> {
    this.fastify.log.info({ msg: `🔍 Attempting to restore user with ID: ${userId}` })
    
    // Check if user exists and is not deleted
    const user = await databaseService.findUserById(userId)
    
    if (user) {
      this.fastify.log.warn({ msg: `❌ User is not deleted with ID: ${userId}` })
      return false
    }

    // Try to restore the deleted user
    const restoredUser = await databaseService.restoreUser(userId)
    
    if (!restoredUser) {
      this.fastify.log.warn({ msg: `❌ Deleted user not found with ID: ${userId}` })
      return false
    }

    this.fastify.log.info({ msg: `✅ User ${restoredUser.email} restored successfully` })
    
    return true
  }
}
