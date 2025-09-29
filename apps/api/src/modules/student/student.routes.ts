import { FastifyInstance } from 'fastify'
import { StudentService } from './student.service'
import { requireRole, requireAdmin, requireFacultyOrAdmin, requireAnyRole } from '../../plugins/rbac'

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' }
  }
}

const createStudentSchema = {
  type: 'object',
  required: ['email', 'name', 'password', 'rollNumber', 'department', 'year'],
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2 },
    password: { type: 'string', minLength: 6 },
    rollNumber: { type: 'string', minLength: 1 },
    department: { type: 'string', minLength: 1 },
    year: { type: 'integer', minimum: 1, maximum: 10 },
    division: { type: 'string' },
    academicYear: { type: 'string' },
    prn: { type: 'string' }
  }
}

const updateStudentSchema = {
  type: 'object',
  properties: {
    rollNumber: { type: 'string', minLength: 1 },
    department: { type: 'string', minLength: 1 },
    year: { type: 'integer', minimum: 1, maximum: 10 },
    division: { type: 'string' },
    academicYear: { type: 'string' },
    prn: { type: 'string' }
  }
}

const paginationQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
  }
}

export default async function studentRoutes(fastify: FastifyInstance) {
  const studentService = new StudentService(fastify)

  // Create student route
  fastify.post('/', {
    preHandler: [fastify.authenticate, requireFacultyOrAdmin()],
    schema: {
      tags: ['students'],
      summary: 'Create a new student',
      description: 'Create a new student account with role-specific data',
      body: createStudentSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            student: {
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
            }
          }
        },
        400: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const studentData = request.body as any
      const result = await studentService.createStudent(studentData)
      
      reply.status(201).send({
        success: true,
        student: result
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message
      })
    }
  })

  // Get all students route
  fastify.get('/', {
    preHandler: [fastify.authenticate, requireFacultyOrAdmin()],
    schema: {
      tags: ['students'],
      summary: 'Get all students',
      description: 'Get paginated list of all students',
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
                  rollNumber: { type: 'string' },
                  department: { type: 'string' },
                  year: { type: 'integer' },
                  division: { type: 'string' },
                  academicYear: { type: 'string' },
                  prn: { type: 'string' },
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
      const result = await studentService.getAllStudents({ page, limit })
      
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

  // Get student by ID route
  fastify.get('/:id', {
    preHandler: [fastify.authenticate, requireAnyRole()],
    schema: {
      tags: ['students'],
      summary: 'Get student by ID',
      description: 'Get a specific student by their ID',
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
            student: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                rollNumber: { type: 'string' },
                department: { type: 'string' },
                year: { type: 'integer' },
                division: { type: 'string' },
                academicYear: { type: 'string' },
                prn: { type: 'string' },
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
      const student = await studentService.getStudentById(id)
      
      if (!student) {
        return reply.status(404).send({
          success: false,
          error: 'Student not found'
        })
      }

      reply.send({
        success: true,
        student
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Update student route
  fastify.put('/:id', {
    preHandler: [fastify.authenticate, requireFacultyOrAdmin()],
    schema: {
      tags: ['students'],
      summary: 'Update student',
      description: 'Update student information',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: updateStudentSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
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
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const updateData = request.body as any
      const student = await studentService.updateStudent(id, updateData)
      
      if (!student) {
        return reply.status(404).send({
          success: false,
          error: 'Student not found'
        })
      }

      reply.send({
        success: true,
        student
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })

  // Delete student route
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate, requireAdmin()],
    schema: {
      tags: ['students'],
      summary: 'Delete student',
      description: 'Delete a student (soft delete)',
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
      const deleted = await studentService.deleteStudent(id)
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          error: 'Student not found'
        })
      }

      reply.send({
        success: true,
        message: 'Student deleted successfully'
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message
      })
    }
  })
}
