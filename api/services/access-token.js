import jwt from 'jsonwebtoken';
import { Logger } from '../utils/index.js';

/**
 * @param {Object} user User object as stored in db
 * @param {number} minutes Number of minutes the token is valid for; default 10
 * @returns Generated access token
 */
async function generateAccessToken(user) {
  try {
    // Generate access token valid for 10 minutes by default
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${parseInt(process.env.ACCESS_TOKEN_EXPIRY) || 15}m` }
    );

    return token;
  } catch (err) {
    Logger.error(err.message);
    throw new Error('Failed to generate access token');
  }
}

/**
 * @param {string} token Access token supplied by client
 * @param {string[]} allowed_roles Roles allowed to access this route
 * @returns Decoded user object (payload contains user id and roles)
 */
async function validateAccessToken(token, allowed_roles) {
  try {
    if (!token) throw new Error('No token provided');

    // Decode token and get payload
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => (err ? null : decoded)
    );
    if (!payload) throw new Error('Invalid token');

    // Validate user roles
    const authorized = allowed_roles.includes(payload.role);
    if (!authorized) return null;

    return payload;
  } catch (err) {
    Logger.error(err.message);
    return null;
  }
}

export { generateAccessToken, validateAccessToken };
