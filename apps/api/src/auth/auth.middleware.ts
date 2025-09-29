import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>
  }
}

export function setupAuthMiddleware(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
      // The JWT payload is now directly available as request.user
      fastify.log.info({ msg: `🔐 Authentication successful for user:`, user: request.user })
    } catch (err) {
      fastify.log.error({ msg: `❌ Authentication failed:`, error: err })
      reply.status(401).send({
        success: false,
        error: 'Unauthorized'
      })
    }
  })
}
