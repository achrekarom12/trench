import { FastifyInstance } from 'fastify'
import { AdminService } from './admin.service'
import { requireRole, requireAdmin, requireFacultyOrAdmin, requireAnyRole } from '../../plugins/rbac'

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' }
  }
}

const createAdminSchema = {
  type: 'object',
  required: ['email', 'name', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2 },
    password: { type: 'string', minLength: 6 },
    department: { type: 'string' }
  }
}

const updateAdminSchema = {
  type: 'object',
  properties: {
    department: { type: 'string' }
  }
}

const paginationQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
  }
}

export default async function adminRoutes(fastify: FastifyInstance) {
  const adminService = new AdminService(fastify)

  // Create admin route
  fastify.post('/', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['admins'],
      summary: 'Create a new admin',
      description: 'Create a new admin account with role-specific data',
      body: createAdminSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            admin: {
              type: 'object',
              properties: {
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
            }
          }
        },
        400: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const adminData = request.body as any
      const result = await adminService.createAdmin(adminData)
      
      reply.status(201).send({
        success: true,
        admin: result
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Get all admins route
  fastify.get('/', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['admins'],
      summary: 'Get all admins',
      description: 'Get paginated list of all admins',
      querystring: paginationQuerySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  department: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string' },
                      createdAt: { type: 'string' }
                    }
                  }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' }
              }
            }
          }
        },
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const { page, limit } = request.query as { page?: number; limit?: number }
      const result = await adminService.getAllAdmins({ page, limit })
      
      reply.send({
        success: true,
        ...result
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Get admin by ID route
  fastify.get('/:id', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['admins'],
      summary: 'Get admin by ID',
      description: 'Get a specific admin by their ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            admin: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                department: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    name: { type: 'string' },
                    role: { type: 'string' },
                    createdAt: { type: 'string' }
                  }
                }
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
      const { id } = request.params as { id: string }
      const admin = await adminService.getAdminById(id)
      
      if (!admin) {
        return reply.status(404).send({
          success: false,
          error: 'Admin not found'
        })
      }

      reply.send({
        success: true,
        admin
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Update admin route
  fastify.put('/:id', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['admins'],
      summary: 'Update admin',
      description: 'Update admin information',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: updateAdminSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            admin: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                department: { type: 'string' }
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
      const { id } = request.params as { id: string }
      const updateData = request.body as any
      const admin = await adminService.updateAdmin(id, updateData)
      
      if (!admin) {
        return reply.status(404).send({
          success: false,
          error: 'Admin not found'
        })
      }

      reply.send({
        success: true,
        admin
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Delete admin route
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['admins'],
      summary: 'Delete admin',
      description: 'Delete an admin (soft delete)',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const deleted = await adminService.deleteAdmin(id)
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          error: 'Admin not found'
        })
      }

      reply.send({
        success: true,
        message: 'Admin deleted successfully'
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })
}
