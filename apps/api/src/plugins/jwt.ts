import 'dotenv/config'
import fp from 'fastify-plugin'
import fjwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'
import { setupAuthMiddleware } from '../auth/auth.middleware'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
  
  if (!process.env.JWT_SECRET) {
    fastify.log.warn('JWT_SECRET not found in environment variables, using fallback secret')
  }
  
  await fastify.register(fjwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: '7d',
    },
  })

  setupAuthMiddleware(fastify)
})

export { }
