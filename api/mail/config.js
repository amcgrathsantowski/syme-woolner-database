import { config } from 'dotenv';
import { createTransport } from 'nodemailer';

let MailTransporter;

if (!MailTransporter) {
  config();
  MailTransporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });
}

export default MailTransporter;
