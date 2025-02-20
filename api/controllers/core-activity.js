import { Op } from 'sequelize';
import HttpError from 'http-errors';
import {
  CoreActivity,
  CoreActivityParticipants,
  Client
} from '../database/models/index.js';
import {
  getModelPaginated,
  getBridgeModelChartData
} from '../services/index.js';
import { getPaginationParams, Logger, dateToCurrent } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/core-activity
 * @desc   Add a new core activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} type body - Type of the core activity
 * @param  {Date} date body - Date of the core activity
 *
 * @returns {object} Message and core activity object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function addCoreActivity(request, response, next) {
  const { type, date, number_of_clients } = request.body;
  if (!type) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }

  try {
    const date_str = dateToCurrent(date);
    const core_activity = await CoreActivity.create({
      date: date_str,
      type,
      number_of_clients: number_of_clients
    });

    Logger.info(
      `Core Activity Controller - New Core Activity added - ID: <${core_activity.id}>`
    );
    response.status(201).json({
      message: 'Core Activity entry created successfully',
      core_activity
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/core-activity/:id
 * @desc   Get core activity by ID
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the core activity
 *
 * @returns {object} Core activity object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If core activity is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If core activity is not found
 * @status  500 - On server error
 */
async function getCoreActivity(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Core Activity ID required'));
  }

  try {
    const core_activity = await CoreActivity.findByPk(id);
    if (!core_activity) {
      return next(new HttpError.NotFound('Core Activity entry not found'));
    }

    Logger.info(
      `Core Activity Controller - Core Activity retrieved - ID: <${id}>`
    );
    response.status(200).json({ core_activity });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/core-activity/:id
 * @desc   Update a core activity's details
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the core activity
 * @param  {String} type body - Type of the core activity
 * @param  {Date} date body - Date of the core activity
 *
 * @returns {object} Message and core activity object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If core activity is not found
 * @throws  {BadRequest} If no fields are provided
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If core activity is not found
 * @status  500 - On server error
 */
async function updateCoreActivity(request, response, next) {
  const { id } = request.params;
  const { type, date, number_of_clients } = request.body;
  if (!id) {
    return next(new HttpError.BadRequest('Core Activity ID required'));
  }
  if (!type && !date && !number_of_clients) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }

  try {
    const core_activity = await CoreActivity.findByPk(id);
    if (!core_activity) {
      return next(new HttpError.NotFound('Core Activity entry not found'));
    }

    if (type) core_activity.type = type;
    if (date) core_activity.date = dateToCurrent(date);
    if (number_of_clients) core_activity.number_of_clients = number_of_clients;

    core_activity.save();

    Logger.info(
      `Core Activity Controller - Core Activity updated - ID: <${id}>`
    );
    response.status(200).json({
      message: 'Core Activity entry updated successfully',
      core_activity
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/core-activity/:id
 * @desc   Delete a core activity and its participants
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the core activity
 *
 * @returns {object} Message and core activity object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If core activity is not found
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If core activity is not found
 * @status  500 - On server error
 */
async function deleteCoreActivity(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Core Activity ID required'));
  }

  try {
    const core_activity = await CoreActivity.findByPk(id);

    if (!core_activity) {
      return next(new HttpError.NotFound('Core Activity entry not found'));
    }

    Logger.info(
      `Core Activity Controller - Deleting Core Activity Participants - ID: <${id}>`
    );

    core_activity.destroy();

    Logger.info(
      `Core Activity Controller - Core Activity and Participants deleted - ID: <${id}>`
    );
    response.status(200).json({
      message:
        'Core Activity entry and Participating Client entries deleted successfully',
      core_activity
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/core-activity?page=<number>&page_size=<number>
 * @desc   Get all core activities
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of entries to retrieve per page
 *
 * @returns {object} Object containing the core activities retrieved and the total number of core activities
 *
 * @throws  {NotFound} If no core activities are found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no core activities are found
 * @status  500 - On server error
 */
async function getCoreActivitiesPaginated(request, response, next) {
  try {
    const { count, rows } = await getModelPaginated(
      request.query,
      CoreActivity
    );

    if (!rows.length) {
      return next(new HttpError.NotFound('No Core Activities found'));
    }

    Logger.info(
      `Core Activity Controller - <${rows.length}> Core Activities retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/core-activity/upcoming
 * @desc   Get all upcoming core activities
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @returns {object} Message and core activity array
 *
 * @throws  {NotFound} If no core activities found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no core activities found
 * @status  500 - On server error
 */
async function getUpcomingCoreActivities(request, response, next) {
  try {
    const { rows, count } = await CoreActivity.findAndCountAll({
      where: {
        date: {
          [Op.gte]: new Date().toISOString().slice(0, 10)
        }
      },
      order: [['date', 'ASC']]
    });

    if (!rows.length) {
      return next(new HttpError.NotFound('No Upcoming Core Activities found'));
    }

    Logger.info(
      `Core Activity Controller - Upcoming Core Activities retrieved`
    );
    response.status(200).json({
      rows,
      count
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/core-activity/chart?period=<string>&date=<ISO Date>
 * @desc   Get all core activity entries by period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the core activities in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the special events for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/core-activity/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function coreActivityChartByPeriod(request, response, next) {
  const { period, date } = request.query;

  try {
    const data = await getBridgeModelChartData(CoreActivity, period, date);

    Logger.info(
      `Core Activity Controller - Core Activity chart by period - Period: <${
        period || 'd'
      }> - Date: <${date || new Date().toISOString().slice(0, 10)}>`
    );
    response.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * @method POST
 * @route  /api/employee/core-activity/:id/participants
 * @desc   Add participants to a core activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the core activity
 * @param  {Array} client_ids body - Array of client IDs to add to the core activity
 *
 * @returns {object} Message and core activity object
 *
 * @throws  {BadRequest} If ID or client IDs are missing
 * @throws  {BadRequest} If client IDs is not an array
 * @throws  {NotFound} If core activity is not found
 * @throws  {NotFound} If 1 or more client IDs are not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  404 - If core activity not found
 * @status  404 - If 1 or more client IDs are not found
 * @status  500 - On server error
 */
async function addCoreActivityParticipants(request, response, next) {
  const { id } = request.params;
  const { client_ids } = request.body;
  if (!id || !client_ids) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (!Array.isArray(client_ids)) {
    return next(new HttpError.BadRequest("Client ID's must be an array"));
  }

  try {
    const core_activity = await CoreActivity.findByPk(id);
    if (!core_activity) {
      return next(new HttpError.NotFound('Core Activity entry not found'));
    }

    const client_id_set = [...new Set(client_ids)];

    const clients = await Client.findAll({
      where: {
        id: client_id_set
      }
    });
    if (clients.length !== client_id_set.length) {
      return next(new HttpError.NotFound('1 or more Client entries not found'));
    }

    const existing_participants = await CoreActivityParticipants.findAll({
      where: {
        core_activity_id: id,
        client_id: client_id_set
      }
    });

    const existing_client_ids = [];
    if (existing_participants.length) {
      existing_participants.forEach((participant) => {
        existing_client_ids.push(participant.client_id);
      });
    }

    const ids_to_insert = existing_client_ids.length
      ? client_id_set.filter(
          (client_id) => !existing_client_ids.includes(client_id)
        )
      : client_id_set;

    const core_activity_participants =
      await CoreActivityParticipants.bulkCreate(
        ids_to_insert.map((client_id) => ({
          core_activity_id: id,
          client_id
        }))
      );

    Logger.info(
      `Core Activity Controller - <${core_activity_participants.length}> Core Activity Participants added - ID: <${id}>`
    );
    response.status(201).json({
      message: 'Core Activity Participants added successfully',
      core_activity_participants
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/core-activity/:id/participants
 * @desc   Remove participants from a core activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the core activity
 * @param  {Array} client_ids body - Array of client IDs to remove from the core activity
 *
 * @returns {object} Message and core activity object
 *
 * @throws  {BadRequest} If ID or client IDs are missing
 * @throws  {BadRequest} If client IDs is not an array
 * @throws  {NotFound} If core activity is not found
 * @throws  {NotFound} If 1 or more client IDs are not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If core activity not found
 * @status  404 - If 1 or more client IDs are not found
 * @status  500 - On server error
 */
async function removeCoreActivityParticipants(request, response, next) {
  const { id } = request.params;
  const { client_ids } = request.body;
  if (!id || !client_ids) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (!Array.isArray(client_ids)) {
    return next(new HttpError.BadRequest("Client ID's must be an array"));
  }

  try {
    const core_activity = await CoreActivity.findByPk(id);
    if (!core_activity) {
      return next(new HttpError.NotFound('Core Activity entry not found'));
    }

    const client_id_set = [...new Set(client_ids)];

    const clients = await Client.findAll({
      where: {
        id: client_id_set
      }
    });
    if (clients.length !== client_id_set.length) {
      return next(new HttpError.NotFound('1 or more Client entries not found'));
    }

    const core_activity_participants = await CoreActivityParticipants.destroy({
      where: {
        core_activity_id: id,
        client_id: client_id_set
      }
    });

    Logger.info(
      `Core Activity Controller - <${core_activity_participants.length}> Core Activity Participants removed - ID: <${id}>`
    );
    response.status(200).json({
      message: 'Core Activity Participants removed successfully',
      core_activity_participants
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/core-activity/:id/participants?page=<number>&page_size=<number>
 * @desc   Get all participants for a core activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the core activity
 *
 * @returns {object} Object containing core activity and participants and the total number of participants
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If core activity is not found
 * @throws  {NotFound} If no core activity participants are found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If core activity not found
 * @status  404 - If no core activity participants are found
 * @status  500 - On server error
 */
async function getCoreActivityParticipantsPaginated(request, response, next) {
  const { id } = request.params;
  const { limit, offset } = getPaginationParams(request);

  if (!id) {
    return next(new HttpError.BadRequest('Core Activity ID required'));
  }

  try {
    const core_activity = await CoreActivity.findByPk(id);
    if (!core_activity) {
      return next(new HttpError.NotFound('Core Activity entry not found'));
    }

    const { rows, count } = await CoreActivityParticipants.findAndCountAll({
      where: {
        core_activity_id: id
      },
      include: [
        {
          model: Client,
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      limit,
      offset
    });

    if (!rows.length) {
      return next(
        new HttpError.NotFound('No Core Activity Participants found')
      );
    }

    Logger.info(
      `Core Activity Controller - <${rows.length}> Core Activity Participants retrieved of <${count}> total - ID: <${id}>`
    );
    response.status(200).json({ core_activity, rows, count });
  } catch (err) {
    next(err);
  }
}

export {
  addCoreActivity,
  getCoreActivity,
  getCoreActivitiesPaginated,
  getUpcomingCoreActivities,
  updateCoreActivity,
  deleteCoreActivity,
  coreActivityChartByPeriod,
  addCoreActivityParticipants,
  removeCoreActivityParticipants,
  getCoreActivityParticipantsPaginated
};
