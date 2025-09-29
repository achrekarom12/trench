import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const loggerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.log.info('Logger plugin registered');
}

export default fp(loggerPlugin, {
  name: 'logger-plugin',
})