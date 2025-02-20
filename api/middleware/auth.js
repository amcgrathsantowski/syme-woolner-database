import HttpError from 'http-errors';
import { validateAccessToken } from '../services/index.js';
import { Logger } from '../utils/logger.js';

/**
 * Middleware to authenticate user based on their access token and their role
 *
 * @param {Array<string>} allowed_roles Roles allowed to access the route
 * @returns {Function} Middleware function
 */
function authenticateRole(allowed_roles) {
  return async (request, response, next) => {
    try {
      const { authorization } = request.headers;

      // Check if authorization header is present
      if (!authorization) {
        return next(new HttpError.Unauthorized());
      }

      const token = authorization.split(' ')[1];
      try {
        // Validate access token
        const payload = await validateAccessToken(token, allowed_roles);
        if (!payload) {
          return next(new HttpError.Forbidden());
        }
      } catch (err) {
        Logger.error(err.message);
        return next(HttpError(498, 'Invalid Token'));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

export default authenticateRole;
