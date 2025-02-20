import { Op } from 'sequelize';
import HttpError from 'http-errors';
import {
  ProjectActivity,
  ProjectActivityParticipants,
  Client
} from '../database/models/index.js';
import {
  getModelPaginated,
  getBridgeModelChartData
} from '../services/index.js';
import { getPaginationParams, Logger, dateToCurrent } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/project-activity
 * @desc   Add a new project activity entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} type body - Type of the project activity
 * @param  {String} description body - Description of the project activity
 * @param  {Date} date body - Date of the entry
 *
 * @returns {object} Message and project activity object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function addProjectActivity(request, response, next) {
  const { type, description, date, number_of_clients } = request.body;
  if (!type && !description && !date && !number_of_clients) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }

  try {
    const date_str = dateToCurrent(date);
    const project_activity = await ProjectActivity.create({
      date: date_str,
      type,
      description: description ?? null,
      number_of_clients: number_of_clients
    });

    Logger.info(
      `Project Activity Controller - New Project Activity added - ID: <${project_activity.id}>`
    );
    response.status(201).json({
      message: 'Project Activity entry created successfully',
      project_activity
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/project-activity/:id
 * @desc   Get all project activity entries
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the client
 *
 * @returns {object} Project activity object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If project activity entry is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If project activity entry is not found
 * @status  500 - On server error
 */
async function getProjectActivity(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Project Activity ID required'));
  }

  try {
    const project_activity = await ProjectActivity.findByPk(id);
    if (!project_activity) {
      return next(new HttpError.NotFound('Project Activity entry not found'));
    }

    Logger.info(
      `Project Activity Controller - Project Activity retrieved - ID: <${id}>`
    );
    response.status(200).json({ project_activity });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/project-activity/:id
 * @desc   Update a project activity entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the project activity
 * @param  {String} type body - Type of the project activity
 * @param  {String} description body - Description of the project activity
 * @param  {Date} date body - Date of the entry
 *
 * @returns {object} Message and project activity object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {NotFound} If project activity entry not found
 * @throws  {InternalServerError} If any other error occurs
 */
async function updateProjectActivity(request, response, next) {
  const { id } = request.params;
  const { type, description, date, number_of_clients } = request.body;
  if (!id) {
    return next(new HttpError.BadRequest('Project Activity ID required'));
  }
  if (!type && !date && !number_of_clients) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }

  try {
    const project_activity = await ProjectActivity.findByPk(id);
    if (!project_activity) {
      return next(new HttpError.NotFound('Project Activity entry not found'));
    }

    if (type) project_activity.type = type;
    if (date) project_activity.date = dateToCurrent(date);
    if (description) project_activity.description = description;
    if (number_of_clients) project_activity.number_of_clients = number_of_clients;

    project_activity.save();

    Logger.info(
      `Project Activity Controller - Project Activity updated - ID: <${id}>`
    );
    response.status(200).json({
      message: 'Project Activity entry updated successfully',
      project_activity
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/project-activity/:id
 * @desc   Delete a project activity entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the project activity
 *
 * @returns {object} Message and project activity object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If project activity entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - On not found
 * @status  500 - On server error
 */
async function deleteProjectActivity(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Project Activity ID required'));
  }

  try {
    const project_activity = await ProjectActivity.findByPk(id);

    if (!project_activity) {
      return next(new HttpError.NotFound('Project Activity entry not found'));
    }

    Logger.info(
      `Project Activity Controller - Deleting Project Activity Participants - ID: <${id}>`
    );

    project_activity.destroy();

    Logger.info(
      `Project Activity Controller - Project Activity and Participants deleted - ID: <${id}>`
    );
    response.status(200).json({
      message:
        'Project Activity entry and Participating Client entries deleted successfully',
      project_activity
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/project-activity?page=<number>&page_size=<number>
 * @desc   Get all project activity entries paginated
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of entries per page
 *
 * @returns {object} Object containing the project activities retrieved and the total number of project activities
 *
 * @throws  {NotFound} If no project activities are found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no project activities are found
 * @status  500 - On server error
 */
async function getProjectActivitiesPaginated(request, response, next) {
  try {
    const { count, rows } = await getModelPaginated(
      request.query,
      ProjectActivity
    );

    if (!rows.length) {
      return next(new HttpError.NotFound('No Project Activities found'));
    }

    Logger.info(
      `Project Activity Controller - <${rows.length}> Project Activities retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/project-activity/upcoming
 * @desc   Get all upcoming project activities
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @returns {object} Message and project activity array
 *
 * @throws  {NotFound} If no project activities found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no project activities found
 * @status  500 - On server error
 */
async function getUpcomingProjectActivities(request, response, next) {
  try {
    const { rows, count } = await ProjectActivity.findAndCountAll({
      where: {
        date: {
          [Op.gte]: new Date().toISOString().slice(0, 10)
        }
      },
      order: [['date', 'ASC']]
    });

    if (!rows.length) {
      return next(
        new HttpError.NotFound('No Upcoming Project Activities found')
      );
    }

    Logger.info(
      `Project Activity Controller - Upcoming Project Activities retrieved`
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
 * @route  /api/employee/project-activity/chart?period=<string>&date=<ISO Date>
 * @desc   Get all project activity entries by period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the project activities in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the special events for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/project-activity/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function projectActivityChartByPeriod(request, response, next) {
  const { period, date } = request.query;

  try {
    const data = await getBridgeModelChartData(ProjectActivity, period, date);

    Logger.info(
      `Project Activity Controller - Project Activity chart by period - Period: <${
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
 * @route  /api/employee/project-activity/:id/participants
 * @desc   Add participants to a project activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the project activity
 * @param  {Array} client_ids body - Array of client IDs to add to the project activity
 *
 * @returns {object} Message and project activity object
 *
 * @throws  {BadRequest} If ID or client IDs are missing
 * @throws  {BadRequest} If client IDs is not an array
 * @throws  {NotFound} If project activity is not found
 * @throws  {NotFound} If 1 or more client IDs are not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  404 - If project activity not found
 * @status  404 - If 1 or more client IDs are not found
 * @status  500 - On server error
 */
async function addProjectActivityParticipants(request, response, next) {
  const { id } = request.params;
  const { client_ids } = request.body;
  if (!id || !client_ids) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (!Array.isArray(client_ids)) {
    return next(new HttpError.BadRequest("Client ID's must be an array"));
  }

  try {
    const project_activity = await ProjectActivity.findByPk(id);
    if (!project_activity) {
      return next(new HttpError.NotFound('Project Activity entry not found'));
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

    const existing_participants = await ProjectActivityParticipants.findAll({
      where: {
        project_activity_id: id,
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

    const project_activity_participants =
      await ProjectActivityParticipants.bulkCreate(
        ids_to_insert.map((client_id) => ({
          project_activity_id: id,
          client_id
        }))
      );

    Logger.info(
      `Project Activity Controller - <${project_activity_participants.length}> Project Activity Participants added - ID: <${id}>`
    );
    response.status(201).json({
      message: 'Project Activity Participants added successfully',
      project_activity_participants
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/project-activity/:id/participants
 * @desc   Remove participants from a project activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the project activity
 * @param  {Array} client_ids body - Array of client IDs to remove from the project activity
 *
 * @returns {object} Message and project activity object
 *
 * @throws  {BadRequest} If ID or client IDs are missing
 * @throws  {BadRequest} If client IDs is not an array
 * @throws  {NotFound} If project activity is not found
 * @throws  {NotFound} If 1 or more client IDs are not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If project activity not found
 * @status  404 - If 1 or more client IDs are not found
 * @status  500 - On server error
 */
async function removeProjectActivityParticipants(request, response, next) {
  const { id } = request.params;
  const { client_ids } = request.body;
  if (!id || !client_ids) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (!Array.isArray(client_ids)) {
    return next(new HttpError.BadRequest("Client ID's must be an array"));
  }

  try {
    const project_activity = await ProjectActivity.findByPk(id);
    if (!project_activity) {
      return next(new HttpError.NotFound('Project Activity entry not found'));
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

    const project_activity_participants =
      await ProjectActivityParticipants.destroy({
        where: {
          project_activity_id: id,
          client_id: client_id_set
        }
      });

    Logger.info(
      `Project Activity Controller - <${project_activity_participants.length}> Project Activity Participants removed - ID: <${id}>`
    );
    response.status(200).json({
      message: 'Project Activity Participants removed successfully',
      project_activity_participants
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/project-activity/:id/participants?page=<number>&page_size=<number>
 * @desc   Get all participants for a project activity
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the project activity
 *
 * @returns {object} Object containing project activity and participants and the total number of participants
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If project activity is not found
 * @throws  {NotFound} If no project activity participants are found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If project activity not found
 * @status  404 - If no project activity participants are found
 * @status  500 - On server error
 */
async function getProjectActivityParticipantsPaginated(
  request,
  response,
  next
) {
  const { id } = request.params;
  const { limit, offset } = getPaginationParams(request);

  if (!id) {
    return next(new HttpError.BadRequest('Project Activity ID required'));
  }

  try {
    const project_activity = await ProjectActivity.findByPk(id);
    if (!project_activity) {
      return next(new HttpError.NotFound('Project Activity entry not found'));
    }

    const { rows, count } = await ProjectActivityParticipants.findAndCountAll({
      where: {
        project_activity_id: id
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
        new HttpError.NotFound('No Project Activity Participants found')
      );
    }

    Logger.info(
      `Project Activity Controller - <${rows.length}> Project Activity Participants retrieved of <${count}> total - ID: <${id}>`
    );
    response.status(200).json({ project_activity, rows, count });
  } catch (err) {
    next(err);
  }
}

export {
  addProjectActivity,
  getProjectActivity,
  getProjectActivitiesPaginated,
  getUpcomingProjectActivities,
  updateProjectActivity,
  deleteProjectActivity,
  projectActivityChartByPeriod,
  addProjectActivityParticipants,
  removeProjectActivityParticipants,
  getProjectActivityParticipantsPaginated
};
