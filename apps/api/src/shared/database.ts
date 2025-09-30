import { PrismaClient } from '../generated/prisma'

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

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

  // Pagination helper
  private getPaginationParams(params: PaginationParams = {}) {
    const page = Math.max(1, params.page || 1)
    const limit = Math.min(100, Math.max(1, params.limit || 10)) // Max 100 items per page
    const skip = (page - 1) * limit
    
    return { page, limit, skip }
  }

  // User operations
  async createUser(userData: {
    email: string
    name: string
    password: string
    role?: 'STUDENT' | 'FACULTY' | 'ADMIN'
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
          role: userData.role || 'STUDENT',
          isDeleted: false,
          deletedAt: null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
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
        role: userData.role || 'STUDENT',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
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
        role: true,
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
        role: true,
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

  async getAllUsers(paginationParams: PaginationParams = {}): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = this.getPaginationParams(paginationParams)
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          isDeleted: false,
        },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          isDeleted: true,
          deletedAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.user.count({
        where: {
          isDeleted: false,
        }
      })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  async getAllUsersIncludingDeleted() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
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

  // Student operations
  async createStudent(studentData: {
    email: string
    name: string
    password: string
    rollNumber: string
    departmentId: string
    year: number
    division?: string
    academicYear?: string
    prn?: string
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Create user first
      const userId = `user_${this.generateId()}`
      const user = await tx.user.create({
        data: {
          id: userId,
          email: studentData.email,
          name: studentData.name,
          password: studentData.password,
          role: 'STUDENT'
        }
      })

      // Create student record
      const student = await tx.student.create({
        data: {
          id: user.id,
          rollNumber: studentData.rollNumber,
          departmentId: studentData.departmentId,
          year: studentData.year,
          division: studentData.division,
          academicYear: studentData.academicYear,
          prn: studentData.prn
        }
      })

      return { user, student }
    })
  }

  async getStudentById(userId: string) {
    return this.prisma.student.findUnique({
      where: { id: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            isDeleted: true,
            deletedAt: true
          }
        }
      }
    })
  }

  // Faculty operations
  async createFaculty(facultyData: {
    email: string
    name: string
    password: string
    employeeId: string
    departmentId: string
    designation?: string
    specialization?: string
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Create user first
      const userId = `user_${this.generateId()}`
      const user = await tx.user.create({
        data: {
          id: userId,
          email: facultyData.email,
          name: facultyData.name,
          password: facultyData.password,
          role: 'FACULTY'
        }
      })

      // Create faculty record
      const faculty = await tx.faculty.create({
        data: {
          id: user.id,
          employeeId: facultyData.employeeId,
          departmentId: facultyData.departmentId,
          designation: facultyData.designation,
          specialization: facultyData.specialization
        }
      })

      return { user, faculty }
    })
  }

  async getFacultyById(userId: string) {
    return this.prisma.faculty.findUnique({
      where: { id: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            isDeleted: true,
            deletedAt: true
          }
        }
      }
    })
  }

  // Admin operations
  async createAdmin(adminData: {
    email: string
    name: string
    password: string
    departmentId: string
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Create user first
      const userId = `user_${this.generateId()}`
      const user = await tx.user.create({
        data: {
          id: userId,
          email: adminData.email,
          name: adminData.name,
          password: adminData.password,
          role: 'ADMIN'
        }
      })

      // Create admin record
      const admin = await tx.admin.create({
        data: {
          id: user.id,
          departmentId: adminData.departmentId
        }
      })

      return { user, admin }
    })
  }

  async getAdminById(userId: string) {
    return this.prisma.admin.findUnique({
      where: { id: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            isDeleted: true,
            deletedAt: true
          }
        }
      }
    })
  }

  // Get all students with user data (paginated)
  async getAllStudents(paginationParams: PaginationParams = {}): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = this.getPaginationParams(paginationParams)
    
    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
              isDeleted: true,
              deletedAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.student.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  // Get all faculty with user data (paginated)
  async getAllFaculty(paginationParams: PaginationParams = {}): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = this.getPaginationParams(paginationParams)
    
    const [faculty, total] = await Promise.all([
      this.prisma.faculty.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
              isDeleted: true,
              deletedAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.faculty.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: faculty,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  // Get all admins with user data (paginated)
  async getAllAdmins(paginationParams: PaginationParams = {}): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = this.getPaginationParams(paginationParams)
    
    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
              isDeleted: true,
              deletedAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.admin.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: admins,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  // Check if roll number exists
  async checkRollNumberExists(rollNumber: string): Promise<boolean> {
    const student = await this.prisma.student.findUnique({
      where: { rollNumber }
    })
    return !!student
  }

  // Check if PRN exists
  async checkPrnExists(prn: string): Promise<boolean> {
    const student = await this.prisma.student.findUnique({
      where: { prn }
    })
    return !!student
  }

  // Check if employee ID exists
  async checkEmployeeIdExists(employeeId: string): Promise<boolean> {
    const faculty = await this.prisma.faculty.findUnique({
      where: { employeeId }
    })
    return !!faculty
  }

  // Update student
  async updateStudent(id: string, data: {
    rollNumber?: string
    departmentId?: string
    year?: number
    division?: string
    academicYear?: string
    prn?: string
  }) {
    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            isDeleted: true,
            deletedAt: true
          }
        }
      }
    })
  }

  // Update faculty
  async updateFaculty(id: string, data: {
    employeeId?: string
    departmentId?: string
    designation?: string
    specialization?: string
  }) {
    return this.prisma.faculty.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            isDeleted: true,
            deletedAt: true
          }
        }
      }
    })
  }

  // Update admin
  async updateAdmin(id: string, data: {
    departmentId?: string
  }) {
    return this.prisma.admin.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            isDeleted: true,
            deletedAt: true
          }
        }
      }
    })
  }

  // College operations
  async createCollege(collegeData: {
    name: string
    address?: string
    phone?: string
    email?: string
    website?: string
  }) {
    return this.prisma.college.create({
      data: collegeData
    })
  }

  async getAllColleges(paginationParams: PaginationParams = {}): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = this.getPaginationParams(paginationParams)
    
    const [colleges, total] = await Promise.all([
      this.prisma.college.findMany({
        skip,
        take: limit,
        include: {
          departments: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.college.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  async getCollegeById(id: string) {
    return this.prisma.college.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            admins: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true
                  }
                }
              }
            },
            faculty: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true
                  }
                }
              }
            },
            students: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  async updateCollege(id: string, data: {
    name?: string
    address?: string
    phone?: string
    email?: string
    website?: string
  }) {
    return this.prisma.college.update({
      where: { id },
      data
    })
  }

  async deleteCollege(id: string) {
    return this.prisma.college.delete({
      where: { id }
    })
  }

  // Department operations
  async createDepartment(departmentData: {
    name: string
    collegeId: string
  }) {
    return this.prisma.department.create({
      data: departmentData,
      include: {
        college: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }

  async getAllDepartments(paginationParams: PaginationParams = {}): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = this.getPaginationParams(paginationParams)
    
    const [departments, total] = await Promise.all([
      this.prisma.department.findMany({
        skip,
        take: limit,
        include: {
          college: {
            select: {
              id: true,
              name: true
            }
          },
          admins: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true
                }
              }
            }
          },
          faculty: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true
                }
              }
            }
          },
          students: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.department.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: departments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  async getDepartmentById(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        college: true,
        admins: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        },
        faculty: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        },
        students: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        }
      }
    })
  }

  async updateDepartment(id: string, data: {
    name?: string
    collegeId?: string
  }) {
    return this.prisma.department.update({
      where: { id },
      data,
      include: {
        college: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }

  async deleteDepartment(id: string) {
    return this.prisma.department.delete({
      where: { id }
    })
  }

  // Get counts for dashboard statistics
  async getFacultyCount(): Promise<number> {
    return this.prisma.faculty.count()
  }

  async getStudentCount(): Promise<number> {
    return this.prisma.student.count()
  }

  async getAdminCount(): Promise<number> {
    return this.prisma.admin.count()
  }

  async getCollegeCount(): Promise<number> {
    return this.prisma.college.count()
  }

  async getDepartmentCount(): Promise<number> {
    return this.prisma.department.count()
  }

  // Get dashboard statistics
  async getDashboardStats() {
    const [facultyCount, studentCount, adminCount, collegeCount, departmentCount] = await Promise.all([
      this.getFacultyCount(),
      this.getStudentCount(),
      this.getAdminCount(),
      this.getCollegeCount(),
      this.getDepartmentCount()
    ])

    return {
      facultyCount,
      studentCount,
      adminCount,
      collegeCount,
      departmentCount
    }
  }

  // Cleanup
  async disconnect() {
    await this.prisma.$disconnect()
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService()
