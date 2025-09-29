import { PrismaClient } from '../generated/prisma'

// Create a singleton instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database service class to handle all database operations
export class DatabaseService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prisma
  }

  // Generate a unique ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // User operations
  async createUser(userData: {
    email: string
    name: string
    password: string
  }) {
    // Generate custom user ID with prefix
    const userId = `user_${this.generateId()}`
    // First, check if there's a soft-deleted user with the same email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser && existingUser.isDeleted) {
      // Update the existing soft-deleted user
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          id: userId,
          name: userData.name,
          password: userData.password,
          isDeleted: false,
          deletedAt: null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          isDeleted: true,
          deletedAt: true,
        },
      })
    }

    // Create a new user if no existing user with this email
    return this.prisma.user.create({
      data: {
        ...userData,
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    })
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { 
        email,
        isDeleted: false 
      },
    })
  }

  async findUserByEmailIncludingDeleted(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })
    return !user || user.isDeleted
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { 
        id,
        isDeleted: false 
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    })
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
    return this.prisma.user.update({
      where: { 
        id,
        isDeleted: false 
      },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    })
  }

  async deleteUser(id: string) {
    return this.prisma.user.update({
      where: { 
        id,
        isDeleted: false 
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })
  }

  async restoreUser(id: string) {
    return this.prisma.user.update({
      where: { 
        id,
        isDeleted: true 
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    })
  }

  async getAllUsersIncludingDeleted() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    })
  }

  // Password reset token operations
  async createPasswordResetToken(tokenData: {
    userId: string
    token: string
    expiresAt: Date
  }) {
    return this.prisma.passwordResetToken.create({
      data: tokenData,
    })
  }

  async findPasswordResetToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  }

  async markPasswordResetTokenAsUsed(token: string) {
    return this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    })
  }

  async deleteExpiredPasswordResetTokens() {
    return this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }

  // Cleanup
  async disconnect() {
    await this.prisma.$disconnect()
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService()
