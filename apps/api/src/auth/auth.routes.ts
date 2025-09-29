import { FastifyInstance } from 'fastify'
import { AuthService } from './auth.service'
import { CreateUserInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from './auth.types'

const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    rememberMe: { type: 'boolean' }
  }
}

const signupSchema = {
  type: 'object',
  required: ['email', 'password', 'name'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string', minLength: 2 },
    role: { 
      type: 'string', 
      enum: ['STUDENT', 'FACULTY', 'ADMIN'],
      default: 'STUDENT'
    }
  }
}

const forgotPasswordSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email' }
  }
}

const resetPasswordSchema = {
  type: 'object',
  required: ['token', 'password'],
  properties: {
    token: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 6 }
  }
}

const studentSignupSchema = {
  type: 'object',
  required: ['email', 'password', 'name', 'rollNumber', 'department', 'year'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string', minLength: 2 },
    rollNumber: { type: 'string', minLength: 1 },
    department: { type: 'string', minLength: 1 },
    year: { type: 'integer', minimum: 1, maximum: 10 },
    division: { type: 'string' },
    academicYear: { type: 'string' },
    prn: { type: 'string' }
  }
}

const facultySignupSchema = {
  type: 'object',
  required: ['email', 'password', 'name', 'employeeId', 'department'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string', minLength: 2 },
    employeeId: { type: 'string', minLength: 1 },
    department: { type: 'string', minLength: 1 },
    designation: { type: 'string' },
    specialization: { type: 'string' }
  }
}

const adminSignupSchema = {
  type: 'object',
  required: ['email', 'password', 'name'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string', minLength: 2 },
    department: { type: 'string' }
  }
}

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' }
  }
}

export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify)

  // Signup route
  fastify.post('/signup', {
    schema: {
      tags: ['auth'],
      summary: 'User signup',
      description: 'Create a new user account',
      body: signupSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string', enum: ['STUDENT', 'FACULTY', 'ADMIN'] },
                createdAt: { type: 'string' }
              }
            }
          }
        },
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const userData = request.body as CreateUserInput
      const user = await authService.createUser(userData)
      
      reply.status(201).send({
        success: true,
        user
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Login route
  fastify.post('/login', {
    schema: {
      tags: ['auth'],
      summary: 'User login',
      description: 'Authenticate user and return JWT token',
      body: loginSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string', enum: ['STUDENT', 'FACULTY', 'ADMIN'] },
                createdAt: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        },
        401: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const loginData = request.body as LoginInput
      const { user, token } = await authService.login(loginData)
      
      reply.send({
        success: true,
        user,
        token
      })
    } catch (error: any) {
      reply.status(401).send({
        success: false,
        error: error.message
      })
    }
  })

  // Forgot password route
  fastify.post('/forgot-password', {
    schema: {
      tags: ['auth'],
      summary: 'Forgot password',
      description: 'Send password reset email to user',
      body: forgotPasswordSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const forgotPasswordData = request.body as ForgotPasswordInput
      await authService.forgotPassword(forgotPasswordData)
      
      reply.send({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Reset password route
  fastify.post('/reset-password', {
    schema: {
      tags: ['auth'],
      summary: 'Reset password',
      description: 'Reset user password using reset token',
      body: resetPasswordSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const resetPasswordData = request.body as ResetPasswordInput
      await authService.resetPassword(resetPasswordData)
      
      reply.send({
        success: true,
        message: 'Password has been reset successfully'
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Logout route (client-side token invalidation)
  fastify.post('/logout', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['auth'],
      summary: 'User logout',
      description: 'Logout user (client-side token invalidation)',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.send({
      success: true,
      message: 'Successfully logged out'
    })
  })

  // Student registration route
  fastify.post('/signup/student', {
    schema: {
      tags: ['auth'],
      summary: 'Student registration',
      description: 'Create a new student account with role-specific data',
      body: studentSignupSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string' }
              }
            },
            student: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                rollNumber: { type: 'string' },
                department: { type: 'string' },
                year: { type: 'integer' },
                division: { type: 'string' },
                academicYear: { type: 'string' },
                prn: { type: 'string' }
              }
            }
          }
        },
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const studentData = request.body as any
      const result = await authService.createStudent(studentData)
      
      reply.status(201).send({
        success: true,
        user: result.user,
        student: result.student
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Faculty registration route
  fastify.post('/signup/faculty', {
    schema: {
      tags: ['auth'],
      summary: 'Faculty registration',
      description: 'Create a new faculty account with role-specific data',
      body: facultySignupSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string' }
              }
            },
            faculty: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                employeeId: { type: 'string' },
                department: { type: 'string' },
                designation: { type: 'string' },
                specialization: { type: 'string' }
              }
            }
          }
        },
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const facultyData = request.body as any
      const result = await authService.createFaculty(facultyData)
      
      reply.status(201).send({
        success: true,
        user: result.user,
        faculty: result.faculty
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Admin registration route
  fastify.post('/signup/admin', {
    schema: {
      tags: ['auth'],
      summary: 'Admin registration',
      description: 'Create a new admin account with role-specific data',
      body: adminSignupSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string' }
              }
            },
            admin: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                department: { type: 'string' }
              }
            }
          }
        },
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const adminData = request.body as any
      const result = await authService.createAdmin(adminData)
      
      reply.status(201).send({
        success: true,
        user: result.user,
        admin: result.admin
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })
}
