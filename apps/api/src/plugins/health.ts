import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'

interface HealthResponse {
    status: string
    uptime: number
    timestamp: number
}

const healthPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get<{
        Reply: HealthResponse
    }>('/health', {
        schema: {
            tags: ['health'],
            summary: 'Health',
            description: 'Returns the health status of the API',
            response: {
                200: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'ok' },
                        uptime: { type: 'number', example: 123.456 },
                        timestamp: { type: 'number', example: 1640995200000 }
                    }
                }
            }
        }
    }, async (_request: FastifyRequest, _reply: FastifyReply) => {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: Date.now(),
        }
    })
}

export default fp(healthPlugin, {
    name: 'health-plugin',
})