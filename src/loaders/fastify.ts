import fastify from 'fastify';
import cors from '@fastify/cors';
import config from '../config';
import Logger from '../helpers/logger';
import routes from '../routes';
import prismaPlugin from '../plugins/prisma';
import authPlugin from '../plugins/token';
import accessPlugin from '../plugins/access';

export default async () => {
  const server = fastify({ logger: true });
  const logger = new Logger('app');

  server.register(cors);
  server.register(authPlugin);
  server.register(prismaPlugin);
  server.register(accessPlugin);
  routes(server);

  server.addHook('onRequest', (req, reply, done) => {
    logger.debug(`Request received ${req.method} ${req.url}`, {
      body: req.body,
      query: req.query,
    });

    done();
  });

  if (!config.smtp.serverToken) {
    console.warn(
      new Date(Date.now()).toUTCString(),
      '|',
      'Missing SMTP Credentials. Try setting environment variables',
    );
    logger.warn('Missing SMTP Credentials. Try setting environment variables');
  }

  server.listen(
    { port: +config.serverPort, host: config.serverHost },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    },
  );
};
