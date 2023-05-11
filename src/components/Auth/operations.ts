import { db } from '../../helpers/database';
import { checkPassword, hashPassword } from '../../helpers/auth';
import { updateUser } from '../User/operations';
import Logger from '../../helpers/logger';
import { redis } from '../../helpers/cache';
import { generatePin } from '../OTP/operations';
import { NotFoundError } from '@prisma/client/runtime';
import config from '../../config';
import { FastifyRequest } from 'fastify';
import {
  ChangePasswordPayloadSchema,
  AuthenticationSchema,
  UniqueFields,
} from '../../types';
import { ResponseObject } from '../../helpers/utils';
const fastify = require('fastify')();

const logger = new Logger('auth');

export const login = async (
  payload: AuthenticationSchema,
  getSignedJWT: (payload: object) => string,
) => {
  try {
    let user;
    logger.setLogData(payload);
    logger.debug('Received payload');

    const identifier = Object.keys(payload)[0];
    const value = Object.values(payload)[0];
    let whereInput: UniqueFields = {};
    whereInput[identifier as keyof UniqueFields] = value;
    if (payload.password) {
      user = await db.user.findUniqueOrThrow({
        where: whereInput,
      });
      if (user?.password) {
        if (await checkPassword(payload.password, user.password)) {
          let token = getSignedJWT({ sub: value, role: user.role });
          return ResponseObject(200, { user: user, accessToken: token });
        } else {
          return ResponseObject(401, {
            code: 'INVALID_CREDENTIALS',
            message: 'Bad Authentication. Invalid Credentials',
          });
        }
      } else {
        return ResponseObject(401, {
          code: 'BAD_REQUEST',
          message: 'Password is not set for this email. Try login using OTP',
        });
      }
    } else if (config.smtp.serverToken) {
      await generatePin(whereInput);
      return ResponseObject(200, { message: 'ok' });
    } else {
      return ResponseObject(401, {
        code: 'INVALID_CREDENTIALS',
        message: 'Bad Authentication. Invalid Credentials',
      });
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const changePassword = async (payload: ChangePasswordPayloadSchema) => {
  try {
    const identifier = Object.keys(payload)[0];
    const value = Object.values(payload)[0];
    let whereInput: UniqueFields = {};
    whereInput[identifier as keyof UniqueFields] = value;

    const password = await hashPassword(payload.password);
    const updatedUser = await updateUser(whereInput, {
      password: password,
    });

    return { status: 200, response: updatedUser };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        status: 404,
        response: { code: 'NOT_FOUND', message: 'User Not Found.' },
      };
    }
    logger.error(error);
    throw error;
  }
};

export const logout = async (token: string | undefined, exp: number) => {
  try {
    if (!token) {
      throw new Error('Authentication Error: No Token');
    }
    const token_key = `bl_${token}`;
    await redis.set(token_key, token);
    await redis.expireat(token_key, exp);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const verifyToken = async (req: FastifyRequest) => {
  try {
    await req.jwtVerify();
    return { status: 200, response: {} };
  } catch (error) {
    logger.error(error);
    return {
      status: 401,
      response:
        'Authorization token is invalid: The token signature is invalid.',
    };
  }
};
