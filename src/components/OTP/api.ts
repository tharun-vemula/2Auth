import { FastifyReply, FastifyRequest } from 'fastify';
import { generatePin, verifyOTP } from './operations';
import { VerificationBodySchema } from '../../types';

export const otpCreateAPI = async (
  req: FastifyRequest<{ Body: { email?: string; phoneNumber?: string } }>,
  res: FastifyReply,
) => {
  const response = await generatePin({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  });
  res.code(response.status);
  res.send(response.response);
};

export const verifyAPI = async (
  req: FastifyRequest<{ Body: VerificationBodySchema }>,
  res: FastifyReply,
) => {
  let obj = {
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    otp: req.body.otp,
  };
  const response = await verifyOTP(obj, req.server.jwt.sign);
  res.code(response.status);
  res.send(response.response);
};
