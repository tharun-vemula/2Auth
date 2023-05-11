import { FastifyInstance } from 'fastify';
import { changePasswordAPI, loginAPI, logoutAPI, verifyTokenAPI } from './api';

export default (fastify: FastifyInstance, options: any, done: any) => {
  fastify.route({
    method: 'POST',
    url: '/login',
    handler: loginAPI,
  });

  fastify.route({
    method: 'POST',
    url: '/logout',
    handler: logoutAPI,
  });

  fastify.route({
    method: 'PUT',
    url: '/changePassword',
    handler: changePasswordAPI,
  });

  fastify.route({
    method: 'GET',
    url: '/verify',
    handler: verifyTokenAPI,
  });

  done();
};
