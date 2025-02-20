import { config } from 'dotenv';
import MailTransporter from './config.js';
import { Logger } from '../utils/index.js';

async function sendPasswordResetEmail(email, link) {
  config();
  try {
    const info = await MailTransporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Syme-Woolner Account - Password Reset',
      html: `
        <h1>Reset Password</h1>
        <p>
          You are receiving this email because you (or someone else) has requested
          the reset of the password for your account.
        </p>
        <p>
          If you did not request this, please ignore this email and your password
          will remain unchanged. This link is valid for ${
            process.env.PASSWORD_TOKEN_EXPIRY
          } hour${parseInt(process.env.PASSWORD_TOKEN_EXPIRY) === 1 ? '' : 's'}.
        </p>
        <p>
          To reset your password, click the link below:
        </p>
        <a href="${link}">Reset Password</a>
        <p>
          Or copy and paste the following link into your browser:
        </p>
        <a href="${link}">${link}</a>
      `
    });
    Logger.info(`Email sent: ${info.messageId}`);
  } catch (err) {
    Logger.error(err.message);
  }
}

export default sendPasswordResetEmail;
