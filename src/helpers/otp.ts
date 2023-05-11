const crypto = require('node:crypto');
import config from '../config';

const digits = '0123456789';
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
const specialChars = '#!&@';

const generate = () => {
  const length = config.otp.length as number;
  const generateOptions = config.otp.options;

  const allowsChars =
    ((generateOptions.digits || '') && digits) +
    ((generateOptions.lowerCaseAlphabets || '') && lowerCaseAlphabets) +
    ((generateOptions.upperCaseAlphabets || '') && upperCaseAlphabets) +
    ((generateOptions.specialChars || '') && specialChars);
  let password = '';
  while (password.length < length) {
    const charIndex = crypto.randomInt(0, allowsChars.length);
    password += allowsChars[charIndex];
  }
  return password;
};

export default generate;
