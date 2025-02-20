import HttpError from 'http-errors';
import { HarmReduction, Client } from '../database/models/index.js';
import {
  deleteModel,
  getModelPaginated,
  getSingleModelChartData
} from '../services/index.js';
import { Logger, dateToCurrent } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/harm-reduction
 * @desc   Add a new harm reduction entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} client_initials body - Client initials
 * @param  {Number} year_of_birth body - Client year of birth
 * @param  {String} gender body - Gender of the client
 * @param  {String} collection_for body - Collection for
 * @param  {String} kit_type body - Kit type
 * @param  {Date} date body - Date of the entry
 * @param  {String} client_id body - ID of the client
 *
 * @note If client_id is provided, client details are not required
 *
 * @returns {object} Message and harm reduction object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function addHarmReduction(request, response, next) {
  const { collection_for, kit_type, date, client_id } = request.body;
  let { client_initials, year_of_birth, gender } = request.body;

  if (!collection_for || !kit_type) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (!client_id && (!client_initials || !year_of_birth || !gender)) {
    next(
      new HttpError.BadRequest('Client details or Client ID must be provided')
    );
  }

  try {
    const date_str = dateToCurrent(date);

    // If the client_id is provided, check if the client exists
    if (client_id) {
      const client = await Client.findByPk(client_id);
      if (!client) {
        return next(new HttpError.NotFound('Client not found'));
      }
      client_initials = `${client.first_name[0]}${client.last_name[0]}`;
      gender = client.gender;
      if (client.date_of_birth) {
        year_of_birth = new Date(client.date_of_birth).getFullYear();
      }
    }

    const harm_reduction = await HarmReduction.create({
      date: date_str,
      client_initials: client_initials.toUpperCase(),
      year_of_birth,
      gender,
      collection_for,
      kit_type,
      client_id: client_id ?? null
    });

    Logger.info(
      `Harm Reduction Controller - New Harm Reduction entry added - ID: <${harm_reduction.id}>`
    );
    response.status(201).json({
      message: 'Harm Reduction entry created successfully',
      harm_reduction
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/harm-reduction/:id
 * @desc   Get a harm reduction entry by ID
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - Harm reduction ID
 *
 * @returns {object} Harm reduction object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If harm reduction entry is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If harm reduction entry is not found
 * @status  500 - On server error
 */
async function getHarmReduction(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Harm Reduction ID required'));
  }

  try {
    const harm_reduction = await HarmReduction.findByPk(id);
    if (!harm_reduction) {
      return next(new HttpError.NotFound('Harm Reduction entry not found'));
    }

    Logger.info(
      `Harm Reduction Controller - Harm Reduction entry retrieved - ID: <${harm_reduction.id}>`
    );
    response.status(200).json({ harm_reduction });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/harm-reduction/:id
 * @desc   Update a harm reduction entry by ID
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - Harm reduction ID
 * @param  {String} client_initials body - Client initials
 * @param  {Number} year_of_birth body - Client year of birth
 * @param  {String} gender body - Gender of the client
 * @param  {String} collection_for body - Collection for
 * @param  {String} kit_type body - Kit type
 * @param  {Date} date body - Date of the entry
 *
 * @note If client_id is provided, client details are not required
 *
 * @returns {object} Message and harm reduction object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {NotFound} If harm reduction entry is not found
 * @throws  {NotFound} If client_id is provided but is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If harm reduction entry is not found
 * @status  500 - On server error
 */
async function updateHarmReduction(request, response, next) {
  const { id } = request.params;
  const {
    client_initials,
    year_of_birth,
    gender,
    collection_for,
    kit_type,
    date,
    client_id
  } = request.body;

  if (!id) {
    return next(new HttpError.BadRequest('Harm Reduction ID required'));
  }
  if (
    !client_initials &&
    !year_of_birth &&
    !gender &&
    !collection_for &&
    !kit_type &&
    !date &&
    !client_id
  ) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }

  try {
    const harm_reduction = await HarmReduction.findByPk(id);
    if (!harm_reduction) {
      return next(new HttpError.NotFound('Harm Reduction entry not found'));
    }

    // TODO: Add validation and sanitization for all fields

    if (client_initials)
      harm_reduction.client_initials = client_initials.toUpperCase();
    if (year_of_birth) harm_reduction.year_of_birth = year_of_birth;
    if (gender) harm_reduction.gender = gender;
    if (collection_for) harm_reduction.collection_for = collection_for;
    if (kit_type) harm_reduction.kit_type = kit_type;
    if (date) harm_reduction.date = dateToCurrent(date);
    if (client_id) {
      const client = await Client.findByPk(client_id);
      if (!client) {
        return next(new HttpError.NotFound('Client not found'));
      }
      harm_reduction.client_initials = `${client.first_name[0]}${client.last_name[0]}`;
      harm_reduction.gender = client.gender;
      if (client.date_of_birth) {
        harm_reduction.year_of_birth = client.date_of_birth.getFullYear();
      }
      harm_reduction.client_id = client_id;
    }

    harm_reduction.save();

    Logger.info(
      `Harm Reduction Controller - Harm Reduction entry updated - ID: <${harm_reduction.id}>`
    );
    response
      .status(200)
      .json({ message: 'Harm Reduction entry updated', harm_reduction });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/harm-reduction/:id
 * @desc   Delete a harm reduction entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - Harm reduction ID
 *
 * @returns {object} Message and harm reduction object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If harm reduction entry is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If harm reduction entry is not found
 * @status  500 - On server error
 */
async function deleteHarmReduction(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Harm Reduction ID required'));
  }

  try {
    const harm_reduction = await deleteModel(HarmReduction, id);
    if (!harm_reduction) {
      return next(new HttpError.NotFound('Harm Reduction entry not found'));
    }

    Logger.info(
      `Harm Reduction Controller - Harm Reduction deleted - ID: <${id}>`
    );
    response
      .status(200)
      .json({ message: 'Harm Reduction entry deleted', harm_reduction });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/harm-reduction?page=<number>&page_size=<number>
 * @desc   Get all harm reduction entries paginated
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of entries per page
 *
 * @returns {object} Object containing the harm reduction entries retrieved and the total number of harm reduction entries
 *
 * @throws  {NotFound} If no harm reduction entries are found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no harm reduction entries are found
 * @status  500 - On server error
 */
async function getHarmReductionPaginated(request, response, next) {
  try {
    const { count, rows } = await getModelPaginated(
      request.query,
      HarmReduction
    );

    if (!rows.length) {
      return next(new HttpError.NotFound('No Harm Reduction entries found'));
    }

    Logger.info(
      `Harm Reduction Controller - <${rows.length}> Harm Reduction entries retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/harm-reduction/chart?period=<string>&date=<ISO Date>
 * @desc   Get all harm reduction entries by period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the harm reduction records in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the harm reduction records for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/harm-reduction/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function harmReductionChartByPeriod(request, response, next) {
  const { period, date } = request.query;

  try {
    const data = await getSingleModelChartData(HarmReduction, period, date);

    Logger.info(
      `Harm Reduction Controller - Harm Reduction chart by period - Period: <${
        period || 'd'
      }> - Date: <${date || new Date().toISOString().slice(0, 10)}>`
    );
    response.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export {
  addHarmReduction,
  getHarmReduction,
  updateHarmReduction,
  deleteHarmReduction,
  getHarmReductionPaginated,
  harmReductionChartByPeriod
};
