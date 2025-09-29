import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const swaggerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Register Swagger
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Trench API',
        description: 'API documentation for Trench',
        version: '1.0.0',
        contact: {
          name: 'Trench API Support',
          email: 'support@trench.com'
        }
      },
      host: `${process.env.HOST ?? 'localhost'}:3030`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'health', description: 'Health check' },
        { name: 'auth', description: 'Authentication' },
        { name: 'user', description: 'User management' },
      ],
      definitions: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            uptime: { type: 'number', example: 123.456 },
            timestamp: { type: 'number', example: 1640995200000 }
          }
        },
      }
    }
  })

  // Register Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/api',
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject
    },
    transformSpecificationClone: true
  })
}

export default fp(swaggerPlugin, {
  name: 'swagger-plugin'
})
