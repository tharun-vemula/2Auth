import 'fastify';
import { FastifyAuth } from 'src/plugins/token';
import { FastifyAccess } from '../plugins/access';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: FastifyAuth;
    DB: any;
    permit: FastifyAccess;
  }
}
