import dotenv from 'dotenv';

dotenv.config();

const config = {
  environment: process.env.NODE_ENV || 'development',
  serverHost: process.env.HOST,
  serverPort: process.env.NODE_DOCKER_PORT || 3000,
  api: {
    prefix: process.env.API_PREFIX || '/auth/api/v1',
  },
  jwt: {
    secret: 'C1ZWpMja&V0c2vBDFhq^N*VXR1@ekULC',
    expires: '30d',
    issuer: 'api.user.in',
    audience: 'app.user.in',
  },
  otp: {
    length: process.env.OTP_LENGTH || 6,
    options: {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    },
  },
  smtp: {
    username: process.env.EMAIL || '',
    password: process.env.PASSWORD || '',
    port: process.env.SMTP_PORT || '',
    host: process.env.SMTP_HOST || '',
    useEncryption: Boolean(process.env.SMTP_ENCRYPTION) || false,
    service: process.env.SERVICE || '',
    apiKey: process.env.API_KEY || '',
    name: process.env.NAME || '',
    serverToken: process.env.SERVER_TOKEN,
    from: process.env.FROM,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};

export default config;
