import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import HttpError from 'http-errors';
import { Employee, Organization } from '../database/models/index.js';
import databaseBackup from '../database/db.backup.js';
import restoreDatabase from '../database/db.restore.js';
import { generatePasswordResetLink } from '../services/index.js';
import { getPaginationParams, Logger } from '../utils/index.js';
import { sendPasswordResetEmail } from '../mail/index.js';

/**
 * @method  POST
 * @route   /api/admin/employee
 * @desc    Register a new employee
 * @access  Private
 * @roles   Admin
 * @type    Controller
 * @data    JSON
 *
 * @param   {string} first_name body - Employee's first name
 * @param   {string} last_name body - Employee's last name
 * @param   {string} username body - Employee's username
 * @param   {string} email body - Employee's email
 * @param   {string} password body - Employee's password
 * @param   {string} confirm_password body - Employee's password confirmation
 *
 * @returns {object} Message indicating success or failure
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {BadRequest} If passwords do not match
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function registerEmployee(request, response, next) {
  // Extract the fields from the request body and validate their presence
  const { first_name, last_name, username, email, password, confirm_password } =
    request.body;

  if (
    !username ||
    !email ||
    !password ||
    !confirm_password ||
    !first_name ||
    !last_name
  ) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }

  // Check if passwords match
  if (password !== confirm_password) {
    return next(new HttpError.BadRequest('Passwords do not match'));
  }

  // TODO: Add validation and sanitization for all fields

  try {
    // Find the organization the new employee belongs to
    const org_name = 'Syme Woolner';
    const org = await Organization.findOne({ where: { name: org_name } });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmployee = await Employee.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });

    if (existingEmployee) {
      const same =
        existingEmployee.username === username ? 'username' : 'email';
      return next(
        new HttpError.BadRequest(
          `An employee with the same ${same} already exists`
        )
      );
    }

    // Create the new employee
    const employee = await Employee.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      org: org.id
    });

    delete employee.dataValues.password;

    Logger.info(
      `Admin Controller - New Employee created - ID: ${employee.id} | Username: <${employee.username}>`
    );
    response
      .status(201)
      .json({ message: 'Employee created successfully', employee });
  } catch (err) {
    next(err);
  }
}

/**
 * @method  GET
 * @route   /api/admin/employee/:id
 * @desc    Get an employee by ID
 * @access  Private
 * @roles   Admin
 * @type    Controller
 * @data    JSON
 *
 * @param   {string} id params - Employee's ID
 *
 * @returns {object} Employee object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If employee is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If employee is not found
 * @status  500 - On server error
 */
async function getEmployee(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Employee ID required'));
  }

  try {
    const employee = await Employee.findByPk(id, {
      attributes: {
        exclude: ['password']
      }
    });
    if (!employee) {
      return next(new HttpError.NotFound('Employee not found'));
    }

    Logger.info(`Admin Controller - Employee retrieved - ID: <${id}>`);
    response.status(200).json({ employee });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/admin/employee/:id
 * @desc   Update an employee's information
 * @access Private
 * @roles  Admin
 * @type   Controller
 * @data   JSON
 *
 * @param  {string} id params - Employee's ID
 * @param  {string} first_name body - Employee's first name
 * @param  {string} last_name body - Employee's last name
 * @param  {string} username body - Employee's username
 * @param  {string} email body - Employee's email
 *
 * @returns {object} Message indicating success or failure
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {NotFound} If employee is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If employee is not found
 * @status  500 - On server error
 */
async function updateEmployee(request, response, next) {
  const { id } = request.params;
  let { first_name, last_name, username, email } = request.body;
  if (!id) {
    return next(new HttpError.BadRequest('Employee ID required'));
  }
  if (!username && !email && !first_name && !last_name) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return next(new HttpError.NotFound('Employee not found'));
    }

    // TODO: Add validation and sanitization for all fields

    if (username) employee.username = username;
    if (email) employee.email = email;
    if (first_name) employee.first_name = first_name;
    if (last_name) employee.last_name = last_name;

    employee.save();

    Logger.info(`Admin Controller - Employee updated - ID: <${id}>`);
    response.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * @method  POST
 * @route   /api/admin/employee/:id/password
 * @desc    Reset an employee's password by sending them a password reset link through email
 * @access  Private
 * @roles   Admin
 * @type    Controller
 * @data    JSON
 *
 * @param   {string} id params - Employee's ID
 *
 * @returns {object} Message indicating success or failure
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If employee is not found
 * @throws  {Forbidden} If employee is an admin
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  403 - If employee is an admin
 * @status  404 - If employee is not found
 * @status  500 - On server error
 *
 * @note    This function does not actually reset the employee's password. It sends them a link to reset their password.
 */
async function resetEmployeePassword(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Employee ID required'));
  }

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return next(new HttpError.NotFound('Employee not found'));
    }
    const link = generatePasswordResetLink(employee);

    sendPasswordResetEmail(employee.email, link);

    Logger.info(
      `Admin Controller - Password reset link sent to Employee - ID: <${employee.id}> | Email: <${employee.email}>`
    );
    response.status(200).json({
      message: 'Email has been sent to the Employee to reset password'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method  DELETE
 * @route   /api/admin/employee/:id
 * @desc    Delete an employee
 * @access  Private
 * @roles   Admin
 * @type    Controller
 * @data    JSON
 *
 * @param   {string} id params - Employee's ID
 *
 * @returns {object} Message indicating success or failure
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If employee is not found
 * @throws  {Forbidden} If employee is an admin
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  403 - If employee is an admin
 * @status  404 - If employee is not found
 * @status  500 - On server error
 */
async function deleteEmployee(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Employee ID required'));
  }

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return next(new HttpError.NotFound('Employee not found'));
    }
    if (employee.role === 'Admin') {
      return next(new HttpError.BadRequest('Cannot delete <Admin>'));
    }

    employee.destroy();

    Logger.info(`Admin Controller - Employee deleted - ID: <${id}>`);
    response.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/admin/employee?page=<number>&page_size=<number>
 * @desc   Get all employees paginated
 * @access Private
 * @roles  Admin
 * @type   Controller
 * @data    JSON
 *
 * @param  {number} page query - Page number to retrieve
 * @param  {number} page_size query - Number of employees to retrieve per page
 *
 * @returns {object} Object containing the employees retrieved and the total number of employees
 *
 * @throws  {NotFound} If no employees are found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no employees are found
 * @status  500 - On server error
 *
 * @note    The page number and page size are retrieved from the query parameters. If they are not provided, the default values are used.
 */
async function getEmployeesPaginated(request, response, next) {
  const { offset, limit } = getPaginationParams(request.query);

  try {
    const { count, rows } = await Employee.findAndCountAll({
      attributes: {
        exclude: ['password']
      },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    if (!rows.length) {
      return next(new HttpError.NotFound('No Employees found'));
    }

    Logger.info(
      `Admin Controller - <${rows.length}> Employees retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

async function getDatabaseBackup(request, response, next) {
  try {
    const { data, filePath } = await databaseBackup();
    if (!data) {
      return next(new HttpError.NotFound('No database found'));
    }
    const date = new Date().toISOString().slice(0, 10);
    Logger.info(`Admin Controller - Database backup created - ${date}`);
    response.status(200).download(filePath, filePath.split('/').pop());
  } catch (err) {
    next(err);
  }
}

async function restoreDatabaseFromBackup(request, response, next) {
  try {
    const { file } = request;
    if (!file) {
      return next(new HttpError.BadRequest('No file uploaded'));
    }
    const { successful, failed, total, not_ran } = await restoreDatabase(file);

    if (!successful) {
      return next(
        new HttpError.InternalServerError('Database restoration failed')
      );
    }

    Logger.info(
      `Admin Controller - Database file uploaded successfully - Total Queries: <${total}> | Successful: <${successful}> | Failed: <${failed}> | Not Ran: <${not_ran}>`
    );
    response.status(200).json({
      message: `Database file uploaded successfully - Total Queries: <${total}> - Successful: <${successful}> - Failed: <${failed}> - Not Ran: <${not_ran}>`
    });
  } catch (err) {
    next(err);
  }
}

export {
  registerEmployee,
  getEmployee,
  updateEmployee,
  resetEmployeePassword,
  deleteEmployee,
  getEmployeesPaginated,
  getDatabaseBackup,
  restoreDatabaseFromBackup
};
