import { FastifyInstance } from 'fastify';
import { otpCreateAPI, verifyAPI } from './api';

export default (fastify: FastifyInstance, options: any, done: any) => {
  fastify.route({
    method: 'POST',
    url: '/authenticateEmail',
    handler: otpCreateAPI,
  });

  fastify.route({
    method: 'POST',
    url: '/verifyEmail',
    handler: verifyAPI,
  });

  done();
};
