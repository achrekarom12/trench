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
    name: { type: 'string', minLength: 2 }
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
}
