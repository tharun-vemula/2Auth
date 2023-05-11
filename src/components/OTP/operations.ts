import { db } from '../../helpers/database';
import generate from '../../helpers/otp';
import sendMail from '../../helpers/mailer';
import Logger from '../../helpers/logger';
import { EmailVerificationTemplate } from '../../constants/message';
import { NotFoundError } from '@prisma/client/runtime';
import { User } from '@prisma/client';
import { UniqueFields, VerificationBodySchema } from '../../types';
import { ResponseObject } from '../../helpers/utils';

const logger = new Logger('otp');

export const generatePin = async (obj: {
  email?: string | null;
  phoneNumber?: string | null;
}) => {
  try {
    const generatedPin = generate();
    if (!obj.email && !obj.phoneNumber) {
      return ResponseObject(400, {
        code: 'BAD_REQUEST',
        message: 'Bad Request. Invalid email or phone number',
      });
    }

    const data = {
      otp: generatedPin,
      email: obj.email,
      phoneNumber: obj.phoneNumber,
    };

    await db.authorizationCode.create({ data });
    const message = EmailVerificationTemplate(generatedPin);

    if (data.email) {
      await sendMail(message, data.email);
    }

    if (data.phoneNumber) {
      // await sendMail(message, data.phoneNumber);
    }

    return ResponseObject(201, { message: 'OTP Sent' });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const verifyOTP = async (
  obj: { email?: string; phoneNumber?: string; otp: string },
  sign: any,
) => {
  try {
    let userDoc: User;
    let doc, token;
    let data = {
      isEmailVerified: false,
      isPhoneNumberVerified: false,
    };
    let identifier;

    let pinDoc = await db.authorizationCode.findUniqueOrThrow({
      where: { otp: obj.otp },
    });

    const Key = Object.keys(obj).filter((key) => {
      if (
        obj[key as keyof VerificationBodySchema] &&
        obj[key as keyof VerificationBodySchema] ===
          pinDoc[key as keyof VerificationBodySchema] &&
        pinDoc.hasOwnProperty(key) &&
        key !== 'otp' &&
        obj.otp == pinDoc.otp
      ) {
        return true;
      }
      return false;
    });

    if (Key && Key[0] == 'email') {
      data.isEmailVerified = true;
      identifier = 'email';
    } else if (Key && Key[0] == 'phoneNumber') {
      data.isPhoneNumberVerified = true;
      identifier = 'phoneNumber';
    } else {
      return ResponseObject(400, {
        code: 'BAD_REQUEST',
        message: 'Invalid Email or Password',
      });
    }

    [userDoc, doc] = await Promise.all([
      await db.user.update({
        where: { email: obj.email },
        data,
      }),
      await db.authorizationCode.delete({ where: { otp: obj.otp } }),
    ]);

    token = sign({
      sub: userDoc[identifier as keyof UniqueFields],
      role: userDoc.role,
    });
    return ResponseObject(200, { accessToken: token });
  } catch (error) {
    if (error instanceof NotFoundError) {
      logger.error(error);
      return {
        status: 400,
        response: { code: 'BAD_REQUEST', message: 'Invalid OTP' },
      };
    }
    logger.error(error);
    throw error;
  }
};
