import fp from 'fastify-plugin';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import ac from '../helpers/accessControl';
import { getRoleFromToken } from '../helpers/auth';
import Logger from '../helpers/logger';

const logger = new Logger('plugin');

const accessPlugin: FastifyPluginAsync = fp(async function (
  server: FastifyInstance,
) {
  server.decorate(
    'permit',
    async function (req: FastifyRequest, res: FastifyReply) {
      try {
        const role = getRoleFromToken(req);
        const permission = ac.can(role).readAny('profile');
        if (!permission.granted) {
          res.code(403);
          res.send('Forbidden');
        }
      } catch (error) {
        logger.error(error);
        throw error;
      }
    },
  );
});

export interface FastifyAccess {
  (req: FastifyRequest, res: FastifyReply): Promise<unknown> | void;
}

export default accessPlugin;
