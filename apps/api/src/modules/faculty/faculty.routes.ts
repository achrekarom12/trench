import { FastifyInstance } from 'fastify'
import { FacultyService } from './faculty.service'
import { requireRole, requireAdmin, requireFacultyOrAdmin, requireAnyRole } from '../../plugins/rbac'

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' }
  }
}

const createFacultySchema = {
  type: 'object',
  required: ['email', 'name', 'password', 'employeeId', 'department'],
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2 },
    password: { type: 'string', minLength: 6 },
    employeeId: { type: 'string', minLength: 1 },
    department: { type: 'string', minLength: 1 },
    designation: { type: 'string' },
    specialization: { type: 'string' }
  }
}

const updateFacultySchema = {
  type: 'object',
  properties: {
    employeeId: { type: 'string', minLength: 1 },
    department: { type: 'string', minLength: 1 },
    designation: { type: 'string' },
    specialization: { type: 'string' }
  }
}

const paginationQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
  }
}

export default async function facultyRoutes(fastify: FastifyInstance) {
  const facultyService = new FacultyService(fastify)

  // Create faculty route
  fastify.post('/', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['faculty'],
      summary: 'Create a new faculty member',
      description: 'Create a new faculty account with role-specific data',
      body: createFacultySchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            faculty: {
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
            }
          }
        },
        400: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const facultyData = request.body as any
      const result = await facultyService.createFaculty(facultyData)
      
      reply.status(201).send({
        success: true,
        faculty: result
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Get all faculty route
  fastify.get('/', {
    preHandler: [fastify.authenticate, requireFacultyOrAdmin()],
    schema: {
      tags: ['faculty'],
      summary: 'Get all faculty',
      description: 'Get paginated list of all faculty members',
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
                  employeeId: { type: 'string' },
                  department: { type: 'string' },
                  designation: { type: 'string' },
                  specialization: { type: 'string' },
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
      const result = await facultyService.getAllFaculty({ page, limit })
      
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

  // Get faculty by ID route
  fastify.get('/:id', {
    preHandler: [fastify.authenticate, requireAnyRole()],
    schema: {
      tags: ['faculty'],
      summary: 'Get faculty by ID',
      description: 'Get a specific faculty member by their ID',
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
            faculty: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                employeeId: { type: 'string' },
                department: { type: 'string' },
                designation: { type: 'string' },
                specialization: { type: 'string' },
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
      const faculty = await facultyService.getFacultyById(id)
      
      if (!faculty) {
        return reply.status(404).send({
          success: false,
          error: 'Faculty member not found'
        })
      }

      reply.send({
        success: true,
        faculty
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Update faculty route
  fastify.put('/:id', {
    preHandler: [fastify.authenticate, requireFacultyOrAdmin()],
    schema: {
      tags: ['faculty'],
      summary: 'Update faculty',
      description: 'Update faculty member information',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: updateFacultySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
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
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const updateData = request.body as any
      const faculty = await facultyService.updateFaculty(id, updateData)
      
      if (!faculty) {
        return reply.status(404).send({
          success: false,
          error: 'Faculty member not found'
        })
      }

      reply.send({
        success: true,
        faculty
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Delete faculty route
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['faculty'],
      summary: 'Delete faculty',
      description: 'Delete a faculty member (soft delete)',
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
      const deleted = await facultyService.deleteFaculty(id)
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          error: 'Faculty member not found'
        })
      }

      reply.send({
        success: true,
        message: 'Faculty member deleted successfully'
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })
}
