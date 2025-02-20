import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Token } from '../database/models/index.js';
import { Logger } from '../utils/index.js';

config();

/**
 * @param {Object} user User object as stored in db
 * @returns Generated password token
 */
async function generatePasswordResetLink(user) {
  try {
    // Expires in 1 hour
    const expires = Date.now() + 1000 * 60 * 60;

    // Generate password token valid for 40 days
    const token = jwt.sign({ id: user.id }, process.env.PASSWORD_TOKEN_SECRET, {
      expiresIn: `${parseInt(process.env.PASSWORD_TOKEN_EXPIRY) || 2}h`
    });

    // Store password token in db
    Token.create({ token, expires });

    return `${process.env.API_ADDRESS}/reset-password?token=${token}`;
  } catch (err) {
    Logger.error(err.message);
    throw new Error('Failed to generate password token');
  }
}

/**
 * @param {string} token Password token supplied by client
 * @returns Decoded user object (payload contains user id)
 */
async function validatePasswordToken(token) {
  if (!token) throw new Error('No token provided');
  try {
    const session = await Token.findOne({ where: { token } });
    if (!session || session.expires < Date.now()) return null;

    // Decode token and get payload
    const payload = jwt.verify(
      token,
      process.env.PASSWORD_TOKEN_SECRET,
      (err, decoded) => (err ? null : decoded)
    );
    if (!payload) throw new Error('Invalid token');

    return payload;
  } catch (err) {
    Logger.error(err.message);
    return null;
  }
}

/**
 * @param {string} token Token to remove from db (expires user session)
 */
async function removePasswordToken(token) {
  try {
    await Token.destroy({ where: { token } });
  } catch (err) {
    Logger.error(err.message);
    throw new Error('Failed to remove password token');
  }
}

export {
  generatePasswordResetLink,
  validatePasswordToken,
  removePasswordToken
};
