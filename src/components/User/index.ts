import { FastifyInstance } from 'fastify';
import {
  createAPI,
  deleteAPI,
  getUserAPI,
  updateAPI,
  getUsersAPI,
  getUsersByIdAPI,
} from './api';

export default (fastify: FastifyInstance, options: any, done: any) => {
  fastify.route({
    method: 'POST',
    url: '/register',
    handler: createAPI,
  });

  fastify.route({
    method: 'PATCH',
    url: '/updateUser',
    handler: updateAPI,
  });

  fastify.route({
    method: 'DELETE',
    url: '/deleteUser',
    handler: deleteAPI,
  });

  fastify.route({
    method: 'GET',
    url: '/profile',
    handler: getUserAPI,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: getUsersAPI,
  });

  fastify.route({
    method: 'POST',
    url: '/',
    handler: getUsersByIdAPI,
  });

  done();
};
