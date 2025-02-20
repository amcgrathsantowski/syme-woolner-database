import jwt from 'jsonwebtoken';
import { Token } from '../database/models/index.js';
import { Logger } from '../utils/index.js';

/**
 * @param {Object} user User object as stored in db
 * @returns Generated refresh token
 */
async function generateRefreshToken(user) {
  try {
    // Expires in 40 days
    const expires = Date.now() + 1000 * 60 * 60 * 24 * 40;

    // Generate refresh token valid for 40 days
    const token = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: `${parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 40}d`
    });

    // Store refresh token in db
    Token.create({ token, expires });

    return token;
  } catch (err) {
    Logger.error(err.message);
    throw new Error('Failed to generate refresh token');
  }
}

/**
 * @param {string} token Refresh token supplied by client
 * @returns Decoded user object (payload contains user id)
 */
async function validateRefreshToken(token) {
  if (!token) throw new Error('No token provided');
  try {
    // Validate refresh token exists and is not expired in db
    const session = await Token.findOne({ where: { token } });
    if (!session || session.expires < Date.now()) return null;

    // Decode token and get payload
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => (err ? null : decoded)
    );

    return payload;
  } catch (err) {
    Logger.error(err.message);
    return null;
  }
}

/**
 * @param {string} token Token to remove from db (expires user session)
 */
async function removeRefreshToken(token) {
  try {
    await Token.destroy({ where: { token } });
  } catch (err) {
    Logger.error(err.message);
    throw new Error('Failed to remove refresh token');
  }
}

export { generateRefreshToken, validateRefreshToken, removeRefreshToken };
