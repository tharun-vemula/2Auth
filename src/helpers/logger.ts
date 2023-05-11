import { info } from 'console';
import winston from 'winston';

// const transports = [];
// if (process.env.NODE_ENV !== 'production') {
//   transports.push(new winston.transports.Console());
// } else {
//   transports.push(
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.cli(),
//         winston.format.splat(),
//       ),
//     }),
//   );
// }

// const Logger = winston.createLogger({
//   level: process.env.STDOUT_LOG_LEVEL || 'debug',
//   levels: winston.config.npm.levels,
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss',
//     }),
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json(),
//   ),
//   transports,
// });

// export default Logger;

const dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};
class LoggerService {
  log_data: null;
  route: string;
  logger: winston.Logger;

  constructor(route: string) {
    this.log_data = null;
    this.route = route;

    const logger = winston.createLogger({
      transports: [
        //new winston.transports.Console(),
        new winston.transports.File({
          filename: `./logs/${route}.log`,
        }),
      ],

      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${
          info.message
        } | `;
        message = info.obj
          ? message + `data:${JSON.stringify(info.obj)} | `
          : message;
        message = this.log_data
          ? message + `log_data:${JSON.stringify(this.log_data)} | `
          : message;
        return message;
      }),
    });
    this.logger = logger;
  }
  setLogData(log_data: any) {
    this.log_data = log_data;
  }

  debug(message: string, obj?: any) {
    if (obj) {
      this.logger.log('info', message, {
        obj,
      });
    } else {
      this.logger.log('info', message);
    }
  }

  info(message: string, obj?: any) {
    if (obj) {
      this.logger.log('info', message, {
        obj,
      });
    } else {
      this.logger.log('info', message);
    }
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: any, obj?: any) {
    if (obj) {
      this.logger.log('info', message, {
        obj,
      });
    } else {
      this.logger.log('info', message);
    }
  }
}

export default LoggerService;
