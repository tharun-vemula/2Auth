import { User } from '@prisma/client';
import config from '../../config';
import { hashPassword } from '../../helpers/auth';
import { db } from '../../helpers/database';
import Logger from '../../helpers/logger';
import { generatePin } from '../OTP/operations';
import { UniqueFields } from '../../types';
import { IFetchUsers } from '../../types';

const logger = new Logger('user');

export const createUser = async (data: User, sign: any) => {
  try {
    const user = await db.user.findMany({
      where: {
        OR: [
          { email: data.email ? data.email : undefined },
          { phoneNumber: data.phoneNumber ? data.phoneNumber : undefined },
          { username: data.username ? data.username : undefined },
        ],
      },
    });
    if (user.length > 0) {
      return {
        code: 'USER_EXISTS',
        message: 'This email is already registered. Try login',
      };
    } else {
      data.password = data.password ? await hashPassword(data.password) : null;
      data.email = data.email ? data.email : null;
      data.phoneNumber = data.phoneNumber ? data.phoneNumber : null;

      if (!config.smtp.serverToken && !data.password) {
        return { status: 401, message: 'Missing Field - Password' };
      }
      const userDoc = await db.user.create({ data });
      if (config.smtp.serverToken) {
        await generatePin({
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
        return { email: data.email, phoneNumber: data.phoneNumber };
      }

      let id = userDoc.id;
      if (userDoc.username) {
        id = userDoc.username;
      } else if (userDoc.email && userDoc.phoneNumber) {
        id = userDoc.id;
      } else if (userDoc.phoneNumber) {
        id = userDoc.phoneNumber;
      } else {
        id = userDoc.email as string;
      }

      return {
        data: {
          user: userDoc,
          token: sign({ sub: id, role: userDoc.role }),
        },
      };
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const updateUser = async (
  identifier: UniqueFields,
  data: Partial<User>,
) => {
  try {
    const user = await db.user.update({ where: identifier, data });
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const deleteUser = async (type: string, value: string) => {
  try {
    let payload: any = {};
    if (type == 'email') {
      payload.email = value;
    } else if (type == 'phoneNumber') {
      payload.phoneNumber = value;
    } else if (type == 'username') {
      payload.username = value;
    }
    const user = await db.user.delete({ where: payload });
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getUsersById = async (payload: IFetchUsers) => {
  try {
    let query = {};
    const key = Object.keys(payload);
    switch (key[0]) {
      case 'id':
        query = { id: { in: payload.username } };
        break;
      case 'phoneNumber':
        query = { phoneNumber: { in: payload.phoneNumber } };
        break;
      case 'email':
        query = { email: { in: payload.email } };
      default:
        break;
    }
    const users = await db.user.findMany({ where: query });
    return users;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
