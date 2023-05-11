const cryptoWrapper = require('crypto');

const algorithm = 'aes-256-cbc';

// generate 16 bytes of random data
const initVector = cryptoWrapper.randomBytes(16);

// protected data
// secret key generate 32 bytes of random data
const Securitykey = cryptoWrapper.randomBytes(32);

// the cipher function
const cipher = cryptoWrapper.createCipheriv(algorithm, Securitykey, initVector);
const decipher = cryptoWrapper.createDecipheriv(
  algorithm,
  Securitykey,
  initVector,
);

// encrypt the message
export const encrypt = (message: string) => {
  let encryptedData = cipher.update(message, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

//decrypt the message
export const decrypt = (encryptedData: string) => {
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};
