import { FastifyInstance } from 'fastify'
import { UserService } from './user.service'

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' }
  }
}

export default async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify)



  // Protected profile route
  fastify.get('/profile', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['user'],
      summary: 'Get user profile',
      description: 'Get the authenticated user\'s profile information',
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
                createdAt: { type: 'string' },
                isDeleted: { type: 'boolean' },
                deletedAt: { type: 'string', nullable: true }
              }
            }
          }
        },
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const userId = request.user?.id || (request.user as any)?.user?.id
      const user = await userService.getUserProfile(userId)
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      reply.send({
        success: true,
        user
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Update profile route
  fastify.put('/profile', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['user'],
      summary: 'Update user profile',
      description: 'Update the authenticated user\'s profile information',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' }
        }
      },
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
                createdAt: { type: 'string' },
                isDeleted: { type: 'boolean' },
                deletedAt: { type: 'string', nullable: true }
              }
            }
          }
        },
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const userId = request.user?.id || (request.user as any)?.user?.id
      const updateData = request.body as { name?: string; email?: string }
      const user = await userService.updateUserProfile(userId, updateData)
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      reply.send({
        success: true,
        user
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Delete user route
  fastify.delete('/profile', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['user'],
      summary: 'Delete user profile',
      description: 'Delete the authenticated user\'s profile (soft delete)',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      // Extract user ID from the JWT payload (handle both old and new structures)
      const userId = request.user?.id || (request.user as any)?.user?.id
      fastify.log.info({ msg: `👤 User ID from token: ${userId}` })
      
      const deleted = await userService.deleteUser(userId)
      
      if (!deleted) {
        fastify.log.warn({ msg: `❌ Failed to delete user: ${userId}` })
        return reply.status(500).send({
          success: false,
          error: 'Failed to delete user'
        })
      }

      fastify.log.info({ msg: `✅ User deletion successful: ${userId}` })
      reply.send({
        success: true,
        message: 'User deleted successfully'
      })
    } catch (error: any) {
      fastify.log.error({ msg: `💥 Error deleting user: ${error.message}`, error })
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })
}
