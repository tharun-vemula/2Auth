import { FastifyInstance } from 'fastify';
import userRoute from '../components/User';
import authRoute from '../components/Auth';
import verifcationRoute from '../components/OTP';
import config from '../config';

export default (fastify: FastifyInstance) => {
  fastify.register(userRoute, { prefix: `${config.api.prefix}/users` });
  fastify.register(authRoute, { prefix: `${config.api.prefix}` });

  if (config.smtp.serverToken) {
    fastify.register(verifcationRoute, {
      prefix: `${config.api.prefix}/verification`,
    });
  }
};
