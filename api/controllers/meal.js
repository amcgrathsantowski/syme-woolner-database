import HttpError from 'http-errors';
import { Meal } from '../database/models/index.js';
import {
  deleteModel,
  getModelPaginated,
  getGroupedModelChartData
} from '../services/index.js';
import { Logger, dateToCurrent } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/meal
 * @desc   Add a new meal entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} type body - Type of meal
 * @param  {Number} number_of_clients body - Number of clients
 * @param  {Date} date body - Date of the entry
 *
 * @returns {object} Message and meal object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {BadRequest} If number of clients is not a number
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - If any required fields are missing
 * @status  400 - If number_of_clients is not a number
 * @status  500 - On server error
 */
async function addMeal(request, response, next) {
  const { type, number_of_clients, date } = request.body;
  const count = parseInt(number_of_clients);
  if (!type || !count) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }
  if (isNaN(count)) {
    return next(new HttpError.BadRequest('Number of clients must be a number'));
  }

  try {
    const date_str = dateToCurrent(date);
    const meal = await Meal.create({
      date: date_str,
      type,
      number_of_clients
    });

    Logger.info(`Meal Controller - New Meal added - ID: <${meal.id}>`);
    response.status(201).json({
      message: 'Meal entry created successfully',
      meal
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/meal/:id
 * @desc   Get all meal entries
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the meal entry
 *
 * @returns {object} Message and meal object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If meal entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If meal entry not found
 * @status  500 - On server error
 */
async function getMeal(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Meal ID required'));
  }

  try {
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return next(new HttpError.NotFound('Meal entry not found'));
    }

    Logger.info(`Meal Controller - Meal retrieved - ID: <${meal.id}>`);
    response.status(200).json({ meal });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/meal/:id
 * @desc   Update a meal entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the meal entry
 * @param  {String} type body - Type of meal
 * @param  {Number} number_of_clients body - Number of clients
 * @param  {Date} date body - Date of the entry
 *
 * @returns {object} Message and meal object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {BadRequest} If number of clients is not a number
 * @throws  {NotFound} If meal entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If meal entry not found
 * @status  500 - On server error
 */
async function updateMeal(request, response, next) {
  const { id } = request.params;
  let { type, number_of_clients, date } = request.body;
  let count = parseInt(number_of_clients);
  if (!id) {
    return next(new HttpError.BadRequest('Meal ID required'));
  }
  if (!type && !count && !date) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }
  if (isNaN(count)) {
    return next(new HttpError.BadRequest('Number of clients must be a number'));
  }

  try {
    const meal = await Meal.findByPk(id);

    if (!meal) {
      return next(new HttpError.NotFound('Meal entry not found'));
    }

    if (type) meal.type = type;
    if (count) meal.number_of_clients = count;
    if (date) meal.date = dateToCurrent(date);

    meal.save();

    Logger.info(`Meal Controller - Meal updated - ID: <${meal.id}>`);
    response.status(200).json({
      message: 'Meal entry updated successfully',
      meal
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/meal/:id
 * @desc   Delete a meal entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} id params - ID of the meal entry
 *
 * @returns {object} Message and meal object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If meal entry not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If meal entry not found
 * @status  500 - On server error
 */
async function deleteMeal(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Meal ID required'));
  }

  try {
    const meal = await deleteModel(Meal, id);
    if (!meal) {
      return next(new HttpError.NotFound('Meal entry not found'));
    }

    Logger.info(`Meal Controller - Meal deleted - ID: <${meal.id}>`);
    response.status(200).json({
      message: 'Meal entry deleted successfully',
      meal
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/meal?page=<number>&page_size=<number>
 * @desc   Get all meal entries
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of items per page
 *
 * @returns {object} Object containing the meals retrieved and the total number of meals
 *
 * @throws  {NotFound} If no meals found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no meals found
 * @status  500 - On server error
 */
async function getMealsPaginated(request, response, next) {
  try {
    const { count, rows } = await getModelPaginated(request.query, Meal);

    if (!rows.length) {
      return next(new HttpError.NotFound('No Meals found'));
    }

    Logger.info(
      `Meal Controller - <${rows.length}> Meals retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/meal/chart?period=<string>&date=<ISO Date>
 * @desc   Get all meal entries by period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the meals in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the meals for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/meal/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function mealChartByPeriod(request, response, next) {
  const { period, date } = request.query;

  try {
    const data = await getGroupedModelChartData(Meal, period, date);
    Logger.info(
      `Meal Controller - Meal chart by period - Period: <${
        period || 'd'
      }> - Date: <${date || new Date().toISOString().slice(0, 10)}>`
    );
    response.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export {
  addMeal,
  getMeal,
  updateMeal,
  deleteMeal,
  getMealsPaginated,
  mealChartByPeriod
};
