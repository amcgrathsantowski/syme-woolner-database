import bcrypt from 'bcryptjs';
import HttpError from 'http-errors';
import { Op } from 'sequelize';

import { Employee } from '../database/models/index.js';
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  removeRefreshToken,
  generatePasswordResetLink,
  validatePasswordToken,
  removePasswordToken
} from '../services/index.js';
import { Logger } from '../utils/index.js';
import { sendPasswordResetEmail } from '../mail/index.js';

/**
 * @method POST
 * @route  /api/auth/login
 * @desc   Login a user
 * @access Public
 * @type   Controller
 * @data    JSON
 *
 * @param  {string} username body - Username or email
 * @param  {string} password body - Password
 * @param  {boolean} remember_me body - Remember me
 *
 * @returns {object} Access token and user object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {Unauthorized} If invalid credentials are provided
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  401 - On failure
 * @status  500 - On server error
 *
 * @note   If remember_me is true, a refresh token is set as a cookie
 */
async function login(request, response, next) {
  try {
    // Extract username and password from request body
    const { username, password, remember_me } = request.body;
    if (!username || !password) {
      return next(new HttpError.BadRequest('Missing required fields'));
    }

    // Find user in db
    const employee = await Employee.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      where: { [Op.or]: [{ username }, { email: username }] }
    });
    if (!employee) {
      return next(new HttpError.Unauthorized('Invalid Credentials'));
    }

    // Validate password
    const valid = await bcrypt.compare(password, employee.password);
    // Remove password from employee object
    delete employee.dataValues.password;

    if (!valid) {
      return next(new HttpError.Unauthorized('Invalid Credentials'));
    }

    // Generate access token
    const token = await generateAccessToken(employee);

    // Set refresh token as cookie if rememberMe is true
    if (remember_me) {
      const refresh_token = await generateRefreshToken(employee);
      response.cookie('token', refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 1000
      });
    }

    Logger.info(`Auth Controller - User logged in - ID: <${employee.id}>`);
    response.status(200).json({
      token,
      ...employee.dataValues
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/auth/refresh
 * @desc   Refresh access token
 * @access Public
 * @type   Controller
 * @data   JSON
 *
 * @param  {string} token cookie - Refresh token
 *
 * @returns {object} Access token and user object
 *
 * @throws  {Unauthorized} If invalid credentials are provided
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  401 - On failure
 * @status  500 - On server error
 */
async function refresh(request, response, next) {
  try {
    // Extract refresh token from cookie and validate its presence
    const { token } = request.cookies;

    if (!token) {
      return next(new HttpError.Unauthorized('No Credentials Provided'));
    }

    // Validate refresh token
    const payload = await validateRefreshToken(token);
    if (!payload) {
      return next(HttpError(498, 'Invalid Credentials'));
    }

    const employee = await Employee.findByPk(payload.id, {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    });

    if (!employee) {
      return next(new HttpError.Unauthorized('Invalid Credentials'));
    }

    // Generate new access token
    const new_token = await generateAccessToken(employee);

    response.status(200).json({
      token: new_token,
      ...employee.dataValues
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/auth/logout
 * @desc   Logout a user by clearing the refresh token cookie and removing it from db
 * @access Public
 * @type   Controller
 * @data   JSON
 *
 * @param  {string} token cookie - Refresh token
 *
 * @returns {object} Message indicating success
 *
 * @throws  {InternalServerError} If any error occurs
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function logout(request, response, next) {
  try {
    // Extract refresh token from cookie, clear the cookie and remove it from db
    const { token } = request.cookies;

    response.clearCookie('token');

    if (token) await removeRefreshToken(token);

    response.status(200).json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/auth/forgot-password?email=<email>
 * @desc   Send password reset link to user through email
 * @access Public
 * @type   Controller
 * @data   JSON
 *
 * @param  {string} email query - User's email
 *
 * @returns {object} Message indicating success
 *
 * @throws  {InternalServerError} If any error occurs
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function forgotPassword(request, response, next) {
  try {
    // Extract email from request query params
    const { email } = request.query;

    if (!email) {
      return next(new HttpError.BadRequest('No email provided'));
    }

    // Find user in db
    const employee = await Employee.findOne({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      },
      where: { email }
    });

    if (employee) {
      const link = await generatePasswordResetLink(employee);

      sendPasswordResetEmail(employee.email, link);

      Logger.info(
        `Auth Controller - Password reset link sent to Employee - ID: <${employee.id}> | Email: <${employee.email}>`
      );
    } else Logger.warn(`Auth Controller - No user found with email: ${email}`);

    response.status(200).json({
      message:
        'If an account with this email exists, a password reset link will be sent to it'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method POST
 * @route  /api/auth/reset-password?token=<token>
 * @desc   Update user's password with reset link
 * @access Public
 * @type   Controller
 * @data   JSON
 *
 * @param  {string} token query - Password reset token
 * @param  {string} password body - New password
 * @param  {string} confirm_password body - New password confirmation
 *
 * @returns {object} Message indicating success
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {BadRequest} If passwords do not match
 * @throws  {Unauthorized} If invalid credentials are provided
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  401 - On failure
 * @status  500 - On server error
 *
 * @note    The token is sent as a query param in the URL and validated using the validatePasswordToken function
 */
async function resetPassword(request, response, next) {
  try {
    // Extract password from request body
    const { token } = request.query;
    const { password, confirm_password } = request.body;

    if (!token) {
      return next(new HttpError.BadRequest('No token provided'));
    }
    if (!password || !confirm_password) {
      return next(new HttpError.BadRequest('Missing required fields'));
    }
    if (password !== confirm_password) {
      return next(new HttpError.BadRequest('Passwords do not match'));
    }

    const payload = await validatePasswordToken(token);

    if (!payload) {
      return next(new HttpError.Unauthorized('Invalid Credentials'));
    }

    removePasswordToken(token);

    // Find user in db
    const employee = await Employee.findByPk(payload.id);

    if (!employee) {
      return next(new HttpError.Unauthorized('Invalid Credentials'));
    }

    // Update password
    employee.password = await bcrypt.hash(password, 10);

    employee.save();

    Logger.info(
      `Auth Controller - Password updated with reset link - ID: <${employee.id}>`
    );
    response.status(200).json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/auth/validate-password-token?token=<token>
 * @desc   Validate password reset token
 * @access Public
 * @type   Controller
 * @data   JSON
 *
 * @param  {string} token query - Password reset token
 *
 * @returns {object} Message indicating success or failure
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {BadRequest} If password token is invalid or expired
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function validatePasswordTokenState(request, response, next) {
  try {
    const { token } = request.query;
    if (!token) {
      return next(new HttpError.BadRequest('No credentials provided'));
    }

    const payload = await validatePasswordToken(token);

    if (!payload) {
      return next(new HttpError.BadRequest('Invalid Credentials'));
    }

    return response.status(200).json({ message: 'Valid token' });
  } catch (err) {
    next(err);
  }
}

export {
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  validatePasswordTokenState
};
