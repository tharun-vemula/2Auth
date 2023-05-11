import 'fastify-jwt';

declare module 'fastify-jwt' {
  interface FastifyJWT {
    payload: { id?: string; sub?: string; role?: string };
  }
}
