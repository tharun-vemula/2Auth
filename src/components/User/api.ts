import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUsersById,
} from './operations';
import statusCodes from '../../constants/http';
import { getIdFromToken } from '../../helpers/auth';
import { UniqueFields, IFetchUsers } from '../../types';

export const createAPI = async (
  req: FastifyRequest<{ Body: User }>,
  res: FastifyReply,
) => {
  const response = await createUser(req.body, req.server.jwt.sign);
  res.send(response);
};

export const updateAPI = async (
  req: FastifyRequest<{
    Body: { identifier: UniqueFields; data: Partial<User> };
  }>,
  res: FastifyReply,
) => {
  const response = await updateUser(req.body.identifier, req.body.data);
  res.code(statusCodes.ok);
  res.send(response);
};

export const deleteAPI = async (
  req: FastifyRequest<{ Querystring: { type: string; value: string } }>,
  res: FastifyReply,
) => {
  await deleteUser(req.query.type, req.query.value);
  res.code(204);
};

export const getUserAPI = async (req: FastifyRequest, res: FastifyReply) => {
  const id = getIdFromToken(req);
  const response = await getUser(id);
  res.code(statusCodes.ok);
  res.send(response);
};

export const getUsersAPI = async (req: FastifyRequest, res: FastifyReply) => {
  const response = await getUsers();
  res.code(statusCodes.ok);
  res.send(response);
};

export const getUsersByIdAPI = async (
  req: FastifyRequest<{ Body: IFetchUsers }>,
  res: FastifyReply,
) => {
  const response = await getUsersById(req.body);
  res.code(statusCodes.ok);
  res.send(response);
};
