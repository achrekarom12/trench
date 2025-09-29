import 'dotenv/config'
import loggerPlugin from './plugins/logger'
import healthPlugin from './plugins/health'
import swaggerPlugin from './plugins/swagger'
import jwtPlugin from './plugins/jwt'
import rbacPlugin from './plugins/rbac'
import { authRoutes } from './auth'
import { userRoutes } from './modules/user'
import { studentRoutes } from './modules/student'
import { facultyRoutes } from './modules/faculty'
import { adminRoutes } from './modules/admin'
import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { databaseService } from './shared/database'

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true })
  
  // Register CORS plugin first
  await app.register(cors, {
    origin: ['http://localhost:3031', 'http://127.0.0.1:3031'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
  
  await app.register(loggerPlugin)
  await app.register(swaggerPlugin)
  await app.register(healthPlugin)
  await app.register(jwtPlugin)
  await app.register(rbacPlugin)
  
  // Register auth routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' })
  
  // Register user routes
  await app.register(userRoutes, { prefix: '/api/v1/user' })
  
  // Register student routes
  await app.register(studentRoutes, { prefix: '/api/v1/students' })
  
  // Register faculty routes
  await app.register(facultyRoutes, { prefix: '/api/v1/faculty' })
  
  // Register admin routes
  await app.register(adminRoutes, { prefix: '/api/v1/admins' })
  
  return app
}

async function start() {
  const port: number = 3030
  const host: string = process.env.HOST ?? 'localhost'

  const app = await buildServer()

  try {
    await app.listen({ port, host })
    app.log.info(`🚀 Trench API running on port http://${host}:${port}/api`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }

  const shutdown = async (signal: NodeJS.Signals) => {
    app.log.info({ signal }, 'Shutting down gracefully')
    await app.close()
    await databaseService.disconnect()
    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch((err) => {
  console.error('❌ Failed to start server', err)
  process.exit(1)
})
