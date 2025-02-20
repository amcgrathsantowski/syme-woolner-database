import { Op } from 'sequelize';
import HttpError from 'http-errors';
import { SpecialEvent } from '../database/models/index.js';
import {
  deleteModel,
  getModelPaginated,
  getGroupedModelChartData
} from '../services/index.js';
import { Logger, dateToCurrent } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/special-event
 * @desc   Add a new special event entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} type body - Type of special event
 * @param  {Number} number_of_clients body - Number of clients
 * @param  {Date} date body - Date of the entry
 *
 * @returns {object} Message and special event object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function addSpecialEvent(request, response, next) {
  const { type, date, number_of_clients } = request.body;
  const count = parseInt(number_of_clients);
  if (!type || !number_of_clients) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (isNaN(count)) {
    return next(new HttpError.BadRequest('Number of people must be a number'));
  }

  try {
    const date_str = dateToCurrent(date);
    const special_event = await SpecialEvent.create({
      date: date_str,
      type,
      number_of_clients: count
    });

    Logger.info(
      `Special Event Controller - New Special Event added - ID: <${special_event.id}>`
    );
    response.status(201).json({
      message: 'Special Event entry created successfully',
      special_event
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/special-event/:id
 * @desc   Get all special event entries
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of special event entry
 *
 * @returns {object} Special event object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If special event entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If special event entry not found
 * @status  500 - On server error
 */
async function getSpecialEvent(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Special Event ID required'));
  }

  try {
    const special_event = await SpecialEvent.findByPk(id);
    if (!special_event) {
      return next(new HttpError.NotFound('Special Event entry not found'));
    }

    Logger.info(
      `Special Event Controller - Special Event retrieved - ID: <${id}>`
    );
    response.status(200).json({ special_event });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/special-event/:id
 * @desc   Update a special event entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of special event entry
 * @param  {String} type body - Type of special event
 * @param  {Number} number_of_clients body - Number of clients
 * @param  {Date} date body - Date of the entry
 *
 * @returns {object} Message and special event object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {BadRequest} If number of clients is not a number
 * @throws  {NotFound} If special event entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If special event entry not found
 * @status  500 - On server error
 */
async function updateSpecialEvent(request, response, next) {
  const { id } = request.params;
  let { type, number_of_clients, date } = request.body;
  let count = parseInt(number_of_clients);
  if (!id) {
    return next(new HttpError.BadRequest('Special Event ID required'));
  }
  if (!type && !count) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }
  if (count && isNaN(count)) {
    return next(new HttpError.BadRequest('Number of people must be a number'));
  }

  try {
    const special_event = await SpecialEvent.findByPk(id);
    if (!special_event) {
      return next(new HttpError.NotFound('Special Event entry not found'));
    }

    if (type) special_event.type = type;
    if (count) special_event.number_of_clients = count;
    if (date) special_event.date = dateToCurrent(date);

    special_event.save();

    Logger.info(
      `Special Event Controller - Special Event updated - ID: <${id}>`
    );
    response.status(200).json({
      message: 'Special Event entry updated successfully',
      special_event
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/special-event/:id
 * @desc   Delete a special event entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of special event entry
 *
 * @returns {object} Message and special event object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If special event entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If special event entry not found
 * @status  500 - On server error
 */
async function deleteSpecialEvent(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Special Event ID required'));
  }

  try {
    const special_event = await deleteModel(SpecialEvent, id);
    if (!special_event) {
      return next(new HttpError.NotFound('Special Event entry not found'));
    }

    Logger.info(
      `Special Event Controller - Special Event deleted - ID: <${id}>`
    );
    response.status(200).json({
      message: 'Special Event entry deleted successfully',
      special_event
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/special-event?page=<number>&page_size=<number>
 * @desc   Get all special event entries paginated
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of entries per page
 *
 * @returns {object} Message and special event object
 *
 * @throws  {NotFound} If no special events found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no special events found
 * @status  500 - On server error
 */
async function getSpecialEventsPaginated(request, response, next) {
  try {
    const { count, rows } = await getModelPaginated(
      request.query,
      SpecialEvent
    );

    if (!rows.length) {
      return next(new HttpError.NotFound('No Special Events found'));
    }

    Logger.info(
      `Special Event Controller - <${rows.length}> Special Events retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/special-event/chart?period=<string>&date=<ISO Date>
 * @desc   Get all special event entries by period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the special events in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the special events for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/special-event/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function specialEventChartByPeriod(request, response, next) {
  const { period, date } = request.query;

  try {
    const data = await getGroupedModelChartData(SpecialEvent, period, date);

    Logger.info(
      `Special Event Controller - Special Event chart by period - Period: <${
        period || 'd'
      }> - Date: <${date || new Date().toISOString().slice(0, 10)}>`
    );
    response.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/special-event/upcoming
 * @desc   Get all upcoming special events
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @returns {object} Message and special event array
 *
 * @throws  {NotFound} If no special events found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no special events found
 * @status  500 - On server error
 */
async function getUpcomingSpecialEvents(request, response, next) {
  try {
    const { rows, count } = await SpecialEvent.findAndCountAll({
      where: {
        date: {
          [Op.gte]: new Date().toISOString().slice(0, 10)
        }
      },
      order: [['date', 'ASC']]
    });

    if (!rows.length) {
      return next(new HttpError.NotFound('No Upcoming Special Events found'));
    }

    Logger.info(`Special Event Controller - Upcoming Special Events retrieved`);
    response.status(200).json({
      rows,
      count
    });
  } catch (err) {
    next(err);
  }
}

export {
  addSpecialEvent,
  getSpecialEvent,
  updateSpecialEvent,
  deleteSpecialEvent,
  getSpecialEventsPaginated,
  specialEventChartByPeriod,
  getUpcomingSpecialEvents
};
