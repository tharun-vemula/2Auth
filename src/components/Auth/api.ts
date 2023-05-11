import { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthenticationToken, stringifyToken } from '../../helpers/auth';

import { login, logout, changePassword, verifyToken } from './operations';

import { AuthenticationSchema, ChangePasswordPayloadSchema } from '../../types';

export const loginAPI = async (
  req: FastifyRequest<{ Body: AuthenticationSchema }>,
  res: FastifyReply,
) => {
  const response = await login(req.body, req.server.jwt.sign);
  res.code(response.status);
  res.send(response.response);
};

export const logoutAPI = async (req: FastifyRequest, res: FastifyReply) => {
  const user = stringifyToken(req);
  const token = getAuthenticationToken(req);
  await logout(token, user.exp);
  res.code(204);
};

export const changePasswordAPI = async (
  req: FastifyRequest<{ Body: ChangePasswordPayloadSchema }>,
  res: FastifyReply,
) => {
  const response = await changePassword(req.body);
  res.code(response.status);
  res.send(response.response);
};

export const verifyTokenAPI = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const response = await verifyToken(req);
  res.code(response.status);
  res.send(response.response);
};
