import HttpError from 'http-errors';
import { Client } from '../database/models/index.js';
import { deleteModel, getModelPaginated } from '../services/index.js';
import { getAge, Logger } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/client
 * @desc   Add a new client
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} first_name body - First name of the client
 * @param  {String} last_name body - Last name of the client
 * @param  {Date} date_of_birth body - Date of birth of the client
 * @param  {Number} age body - Age group of the client
 * @param  {String} gender body - Gender of the client
 * @param  {String} address body - Address of the client
 * @param  {String} postal_code body - Postal code of the client
 * @param  {Number} number_of_children body - Number of children in the client family
 * @param  {Number} number_of_adults body - Number of adults in the client's family
 * @param  {Number} total_family_members body - Total family members of the client
 * @param  {String} contact_number body - Contact number of the client
 * @param  {String} emergency_contact_number body - Emergency contact number of the client
 * @param  {String} emergency_contact_relationship body - Emergency contact relationship of the client
 * @param  {String} date_registered body - Date the client was registered
 *
 * @note   If the date of birth is provided, the age group will be calculated automatically
 * @note   If the date of birth is not provided, the age group must provided
 *
 * @returns {object} Message and client object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function addClient(request, response, next) {
  const {
    first_name,
    last_name,
    date_of_birth,
    age,
    gender,
    address,
    postal_code,
    number_of_children,
    number_of_adults,
    total_family_members,
    contact_number,
    emergency_contact_number,
    emergency_contact_relationship,
    date_registered
  } = request.body;

  if (
    !first_name ||
    !last_name ||
    !gender ||
    !contact_number ||
    !emergency_contact_number ||
    !emergency_contact_relationship
  ) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }

  if (!date_of_birth && !age) {
    return next(
      new HttpError.BadRequest(
        'Either date of birth or age group must be provided'
      )
    );
  }
  let calculated_age;
  if (date_of_birth) calculated_age = getAge(date_of_birth);
  date_registered ? date_registered : new Date(Time.now());

  // TODO: Add validation and sanitization for all fields

  try {
    const client = await Client.create({
      first_name,
      last_name,
      date_of_birth: date_of_birth ?? null,
      age: calculated_age ?? age ?? null,
      gender,
      address,
      postal_code: postal_code ?? null,
      number_of_children: number_of_children ?? null,
      number_of_adults: number_of_adults ?? null,
      total_family_members: total_family_members ?? null,
      contact_number,
      emergency_contact_number,
      emergency_contact_relationship,
      date_registered
    });

    Logger.info(`Client Controller - New client added - ID: <${client.id}>`);
    response
      .status(201)
      .json({ message: 'New client added successfully', client });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/client/:id
 * @desc   Get a client by ID
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the client
 *
 * @returns {object} Client object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If client is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If client is not found
 * @status  500 - On server error
 */
async function getClient(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Client ID required'));
  }

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return next(new HttpError.NotFound('Client not found'));
    }

    Logger.info(`Client Controller - Client retrieved - ID: <${client.id}>`);
    response.status(200).json({ client });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/client/:id
 * @desc   Update a client's information
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the client
 * @param  {String} first_name body - First name of the client
 * @param  {String} last_name body - Last name of the client
 * @param  {Date} date_of_birth body - Date of birth of the client
 * @param  {Number} age body - Age group of the client
 * @param  {String} gender body - Gender of the client
 * @param  {String} address body - Address of the client
 * @param  {String} postal_code body - Postal code of the client
 * @param  {Number} number_of_children body - Number of children in the client family
 * @param  {Number} number_of_adults body - Number of adults in the client's family
 * @param  {Number} total_family_members body - Total family members of the client
 * @param  {String} contact_number body - Contact number of the client
 * @param  {String} emergency_contact_number body - Emergency contact number of the client
 * @param  {String} emergency_contact_relationship body - Emergency contact relationship of the client
 * @param  {String} date_registered body - Date the client was registered
 * 
 * @returns {object} Message and client object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {NotFound} If client is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If client is not found
 * @status  500 - On server error
 */
async function updateClient(request, response, next) {
  const { id } = request.params;
  const {
    first_name,
    last_name,
    date_of_birth,
    age,
    gender,
    address,
    postal_code,
    number_of_children,
    number_of_adults,
    total_family_members,
    contact_number,
    emergency_contact_number,
    emergency_contact_relationship,
    date_registered
  } = request.body;

  if (!id) {
    return next(new HttpError.BadRequest('Client ID required'));
  }

  if (
    !first_name &&
    !last_name &&
    !date_of_birth &&
    !age &&
    !gender &&
    !address &&
    !postal_code &&
    !number_of_children &&
    !number_of_adults &&
    !total_family_members &&
    !contact_number &&
    !emergency_contact_number &&
    !emergency_contact_relationship &&
    !date_registered
  ) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }
  // TODO: Add validation and sanitization for all fields

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return next(new HttpError.NotFound('Client not found'));
    }

    // Check if the field is empty, if it is, use the existing value
    // Made to allow partial updates
    if (first_name) client.first_name = first_name;
    if (last_name) client.last_name = last_name;
    if (date_of_birth) {
      client.date_of_birth = date_of_birth;
      client.age = getAge(date_of_birth);
    }
    if (age && !date_of_birth && !client.date_of_birth)
      client.age = age;
    if (gender) client.gender = gender;
    if (address) client.address = address;
    if (postal_code) client.postal_code = postal_code;
    if (number_of_children) client.number_of_children = number_of_children;
    if (number_of_adults) client.number_of_adults = number_of_adults;
    if (total_family_members)
      client.total_family_members = total_family_members;
    if (contact_number) client.contact_number = contact_number;
    if (emergency_contact_number)
      client.emergency_contact_number = emergency_contact_number;
    if (emergency_contact_relationship)
      client.emergency_contact_relationship = emergency_contact_relationship;
    if (date_registered) client.date_registered = date_registered;

    client.save();

    Logger.info(`Client Controller - Client updated - ID: <${client.id}>`);
    response
      .status(200)
      .json({ message: 'Client updated successfully', client });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/client/:id
 * @desc   Delete a client
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the client
 *
 * @returns {object} Message indicating success
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If client is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If client is not found
 * @status  500 - On server error
 */
async function deleteClient(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Client ID required'));
  }

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return next(new HttpError.NotFound('Client not found'));
    }

    Logger.info(`Client Controller - Deleting Referrals - ID: <${id}>`);
    Logger.info(
      `Client Controller - Deleting Harm Reduction Records - ID: <${id}>`
    );
    Logger.info(
      `Client Controller - Deleting Project Activity Participants - ID: <${id}>`
    );
    Logger.info(
      `Client Controller - Deleting Core Activity Participants - ID: <${id}>`
    );

    await deleteModel(Client, id);

    Logger.info(
      `Client Controller - Client and all related records deleted - ID: <${client.id}>`
    );
    response.status(200).json({
      message: 'Client and all related records deleted successfully',
      client
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/client?page=<number>&page_size=<number>
 * @desc   Get all clients paginated
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of records per page
 *
 * @returns {object} Object containing the clients retrieved and the total number of clients
 *
 * @throws {NotFound} If no clients are found
 * @throws  {InternalServerError} If any error occurs
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function getClientsPaginated(request, response, next) {
  try {
    const { rows, count } = await getModelPaginated(request.query, Client, [
      ['createdAt', 'DESC']
    ]);

    if (!rows.length) {
      return next(new HttpError.NotFound('No Clients found'));
    }

    Logger.info(
      `Client Controller - <${rows.length}> Clients retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

export {
  addClient,
  getClient,
  updateClient,
  deleteClient,
  getClientsPaginated
};
