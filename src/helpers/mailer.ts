import nodemailer from 'nodemailer';

import config from '../config';
import Logger from './logger';

const logger = new Logger('mailer');

interface MailContent {
  subject: string;
  text: string;
}

async function main(content: MailContent, to?: string) {
  let userAccount = config.smtp;

  let transporter = nodemailer.createTransport({
    host: userAccount.host,
    port: +userAccount.port,
    secure: userAccount.useEncryption,
    auth: {
      user: userAccount.username,
      pass: userAccount.password,
    },
  });

  let info = await transporter.sendMail({
    from: userAccount.username,
    to: to,
    subject: content.subject,
    text: content.text,
  });
  logger.setLogData({ email: to, text: content.text, id: info.messageId });
  logger.info('mail sent');
}

export default main;
