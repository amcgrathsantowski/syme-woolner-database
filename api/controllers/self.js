import bcrypt from 'bcryptjs';
import HttpError from 'http-errors';
import { Employee } from '../database/models/index.js';
import { validateAccessToken } from '../services/index.js';
import { Logger } from '../utils/index.js';

/**
 * @method PUT
 * @route  /api/employee/self
 * @desc   Update employee self details
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} first_name body - First name of the employee
 * @param  {String} last_name body - Last name of the employee
 * @param  {String} username body - Username of the employee
 * @param  {String} email body - Email of the employee
 *
 * @returns {object} Message and employee object
 *
 * @throws  {BadRequest} If no authorization header is provided
 * @throws  {BadRequest} If no fields are provided
 * @throws  {Unauthorized} If the token is invalid
 * @throws  {NotFound} If the employee is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If no authorization header is provided
 * @status  400 - If no fields are provided
 * @status  401 - If the token is invalid
 * @status  404 - If the employee is not found
 * @status  500 - On server error
 */
async function updateSelf(request, response, next) {
  const { authorization } = request.headers;
  const { first_name, last_name, username, email } = request.body;

  if (!authorization) {
    return next(new HttpError.BadRequest('Missing authorization header'));
  }
  const token = authorization.split(' ')[1];

  if (!first_name && !last_name && !username && !email) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }

  try {
    const payload = await validateAccessToken(token, ['Admin', 'Employee']);
    if (!payload) {
      return next(new HttpError.Unauthorized());
    }

    const employee = await Employee.findByPk(payload.id, {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    });
    if (!employee) {
      return next(new HttpError.NotFound('Employee not found'));
    }

    // TODO: Add validation and sanitization for all fields

    if (first_name) employee.first_name = first_name;
    if (last_name) employee.last_name = last_name;
    if (username) employee.username = username;
    if (email) employee.email = email;

    employee.save();

    Logger.info(`Self Controller - Employee updated - ID: <${employee.id}>`);
    response.status(200).json({
      message: 'Your details have been updated successfully',
      employee
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/self/password
 * @desc   Update employee self password
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} password body - Current password of the employee
 * @param  {String} new_password body - New password of the employee
 * @param  {String} confirm_password body - Confirm password of the employee
 *
 * @returns {object} Message indicating success
 *
 * @throws  {BadRequest} If no authorization header is provided
 * @throws  {BadRequest} If no fields are provided
 * @throws  {BadRequest} If passwords do not match
 * @throws  {BadRequest} If incorrect password is provided
 * @throws  {Unauthorized} If the token is invalid
 * @throws  {NotFound} If the employee is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If no authorization header is provided
 * @status  400 - If no fields are provided
 * @status  400 - If passwords do not match
 * @status  400 - If incorrect password is provided
 * @status  401 - If the token is invalid
 * @status  404 - If the employee is not found
 * @status  500 - On server error
 */
async function updateSelfPassword(request, response, next) {
  const { authorization } = request.headers;
  const { password, new_password, confirm_password } = request.body;
  if (!authorization) {
    return next(new HttpError.BadRequest('Missing authorization header'));
  }
  const token = authorization.split(' ')[1];

  if (!password || !new_password || !confirm_password) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (new_password !== confirm_password) {
    return next(new HttpError.BadRequest('Passwords do not match'));
  }

  try {
    const payload = await validateAccessToken(token, ['Admin', 'Employee']);
    if (!payload) {
      return next(new HttpError.Unauthorized());
    }

    const employee = await Employee.findByPk(payload.id);
    if (!employee) {
      return next(new HttpError.NotFound('Employee not found'));
    }

    if (!(await bcrypt.compare(password, employee.password))) {
      return next(new HttpError.BadRequest('Incorrect password'));
    }

    // Hash the password
    employee.password = await bcrypt.hash(new_password, 10);

    employee.save();

    Logger.info(
      `Self Controller - Employee password updated - ID: <${employee.id}>`
    );
    response.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}

export { updateSelf, updateSelfPassword };
