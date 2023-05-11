import fp from 'fastify-plugin';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import jwt from '@fastify/jwt';
import { redis } from '../helpers/cache';
import config from '../config/index';
import { getAuthenticationToken } from '../helpers/auth';

const authPlugin: FastifyPluginAsync = fp(async function (
  server: FastifyInstance,
) {
  server.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expires,
      iss: config.jwt.issuer,
      aud: config.jwt.audience,
    },
    decode: { complete: true },
  });

  server.decorate(
    'authenticate',
    async function (req: FastifyRequest, res: FastifyReply) {
      try {
        const token = getAuthenticationToken(req);
        const inDenyList = await redis.get(`bl_${token}`);
        if (inDenyList) {
          return res.status(401).send({
            message: 'Invalid Token. Try Login',
          });
        }
        await req.jwtVerify();
      } catch (ex) {
        res.send(ex);
      }
    },
  );
});

export interface FastifyAuth {
  (req: FastifyRequest, res: FastifyReply): Promise<unknown> | void;
}

export default authPlugin;
