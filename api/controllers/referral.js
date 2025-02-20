import HttpError from 'http-errors';
import { Referral, Client } from '../database/models/index.js';
import {
  deleteModel,
  getModelPaginated,
  getSingleModelChartData
} from '../services/index.js';
import { Logger, dateToCurrent } from '../utils/index.js';

/**
 * @method POST
 * @route  /api/employee/referral
 * @desc   Add a new referral entry
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Date} date body - Date of the entry
 * @param  {String} description body - Description of the entry
 * @param  {Number} shelter_count body - count of shelter referrals provided
 * @param  {Number} housing_count body - count of housing referrals provided
 * @param  {Number} mental_health_count body - count of mental health referrals provided
 * @param  {Number} medical_services_count body - count of medical service referrals provided
 * @param  {Number} income_support_count body - count of income support referrals provided
 * @param  {Number} legal_services_count body - count of legal service referrals provided
 * @param  {Number} settlement_services_count body - count of settlement service referrals provided
 * @param  {Number} harm_reduction_services_count body - count of harm reduction service referrals provided
 * @param  {Number} employment_supports_count body - count of employment supports referrals provided
 * @param  {Number} food_bank_count body - count of food bank referrals provided
 * @param  {Number} meal_service_count body - count of meal service referrals provided
 * @param  {Number} id_clinic_count body - count of id clinic referrals provided
 * @param  {Number} other_count body - count of other referrals provided
 *
 * @returns {object} Message and referral object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  201 - On success
 * @status  400 - On failure
 * @status  500 - On server error
 */
async function addReferral(request, response, next) {
  const { date, description, shelter_count, housing_count, mental_health_count, medical_services_count, income_support_count, legal_services_count, settlement_services_count, harm_reduction_services_count, employment_supports_count, food_bank_count, meal_service_count, id_clinic_count, other_count } =
    request.body;

  if (!date) {
    return next(new HttpError.BadRequest('Missing required fields'));
  }

  // TODO: Add validation and sanitization for all fields

  try {
    const date_str = dateToCurrent(date);

    const referral = await Referral.create({
      date: date_str,
      description: description ?? null,
      shelter_count: shelter_count ?? 0,
      housing_count: housing_count ?? 0,
      mental_health_count: mental_health_count ?? 0,
      medical_services_count: medical_services_count ?? 0,
      income_support_count: income_support_count ?? 0,
      legal_services_count: legal_services_count ?? 0,
      settlement_services_count: settlement_services_count ?? 0,
      harm_reduction_services_count: harm_reduction_services_count ?? 0,
      employment_supports_count: employment_supports_count ?? 0,
      food_bank_count: food_bank_count ?? 0,
      meal_service_count: meal_service_count ?? 0,
      id_clinic_count: id_clinic_count ?? 0,
      other_count: other_count ?? 0
    });

    Logger.info(
      `Referral Controller - New referral added - ID: <${referral.id}>`
    );
    response.status(201).json({
      message: 'Referral created successfully',
      referral
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/referral/:id
 * @desc   Get a referral by ID
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} id params - ID of the referral
 *
 * @returns {object} Referral object
 *
 * @throws  {BadRequest} If any required fields are missing
 * @throws  {NotFound} If referral not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - If ID is not provided
 * @status  404 - If referral not found
 * @status  500 - On server error
 */
async function getReferral(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Referral ID required'));
  }

  try {
    const referral = await Referral.findByPk(id);
    if (!referral) {
      return next(new HttpError.NotFound('Referral not found'));
    }

    Logger.info(`Referral Controller - Referral retrieved - ID: <${id}>`);
    response.status(200).json({ referral });
  } catch (err) {
    next(err);
  }
}

/**
 * @method PUT
 * @route  /api/employee/referral/:id
 * @desc   Update a referral's details
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} id params - ID of the referral
 * @param  {Date} date body - Date of the entry
 * @param  {String} description body - Description of the entry
 * @param  {Number} shelter_count body - count of shelter referrals provided
 * @param  {Number} housing_count body - count of housing referrals provided
 * @param  {Number} mental_health_count body - count of mental health referrals provided
 * @param  {Number} medical_services_count body - count of medical service referrals provided
 * @param  {Number} income_support_count body - count of income support referrals provided
 * @param  {Number} legal_services_count body - count of legal service referrals provided
 * @param  {Number} settlement_services_count body - count of settlement service referrals provided
 * @param  {Number} harm_reduction_services_count body - count of harm reduction service referrals provided
 * @param  {Number} employment_supports_count body - count of employment supports referrals provided
 * @param  {Number} food_bank_count body - count of food bank referrals provided
 * @param  {Number} meal_service_count body - count of meal service referrals provided
 * @param  {Number} id_clinic_count body - count of ID clinic referrals provided
 * @param  {Number} other_count body - count of other referrals provided

 *
 * @returns {object} Message and referral object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {BadRequest} If no fields are provided
 * @throws  {NotFound} If referral not found
 * @throws  {NotFound} If client_id is provided but is not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If referral not found
 * @status  500 - On server error
 */
async function updateReferral(request, response, next) {
  const { id } = request.params;
  const {
    date,
    description,
    shelter_count,
    housing_count,
    mental_health_count,
    medical_services_count, 
    income_support_count, 
    legal_services_count, 
    settlement_services_count,
    harm_reduction_services_count,
    employment_supports_count,
    food_bank_count,
    meal_service_count,
    id_clinic_count,
    other_count
  } = request.body;
  if (!id) {
    return next(new HttpError.BadRequest('Referral ID required'));
  }
  if (
    !date &&
    !description &&
    !shelter_count &&
    !housing_count &&
    !mental_health_count &&
    !medical_services_count &&
    !income_support_count &&
    !legal_services_count &&
    !settlement_services_count && 
    !harm_reduction_services_count && 
    !employment_supports_count && 
    !food_bank_count &&
    !meal_service_count &&
    !id_clinic_count &&
    !other_count
  ) {
    return next(new HttpError.BadRequest('Must include at least 1 field'));
  }

  try {
    const referral = await Referral.findByPk(id);
    if (!referral) {
      return next(new HttpError.NotFound('Referral not found'));
    }

    // TODO: Add validation and sanitization for all fields

    if (date) referral.date = dateToCurrent(date);
    if (description) referral.description = description;
    if (shelter_count) referral.shelter_count = shelter_count;
    if (housing_count) referral.housing_count = housing_count;
    if (mental_health_count) referral.mental_health_count = mental_health_count;
    if (medical_services_count) referral.medical_services_count = medical_services_count;
    if (income_support_count) referral.income_support_count = income_support_count;
    if (legal_services_count) referral.legal_services_count = legal_services_count;
    if (settlement_services_count) referral.settlement_services_count = settlement_services_count;
    if (harm_reduction_services_count) referral.harm_reduction_services_count = harm_reduction_services_count;
    if (employment_supports_count) referral.employment_supports_count = employment_supports_count;
    if (food_bank_count) referral.food_bank_count = food_bank_count;
    if (meal_service_count) referral.meal_service_count = meal_service_count;
    if (id_clinic_count) referral.id_clinic_count = id_clinic_count;
    if (other_count) referral.other_count = other_count;

    referral.save();

    Logger.info(`Referral Controller - Referral updated - ID: <${id}>`);
    response.status(200).json({
      message: 'Referral updated successfully',
      referral
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method DELETE
 * @route  /api/employee/referral/:id
 * @desc   Delete a referral
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} id params - ID of the referral
 *
 * @returns {object} Message and referral object
 *
 * @throws  {BadRequest} If ID is missing
 * @throws  {NotFound} If referral not found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  400 - On failure
 * @status  404 - If referral not found
 * @status  500 - On server error
 */
async function deleteReferral(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return next(new HttpError.BadRequest('Referral ID required'));
  }

  try {
    const referral = await deleteModel(Referral, id);
    if (!referral) {
      return next(new HttpError.NotFound('Referral not found'));
    }

    Logger.info(`Referral Controller - Referral deleted - ID: <${id}>`);
    response.status(200).json({
      message: 'Referral deleted successfully',
      referral
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/referral?page=<number>&page_size=<number>
 * @desc   Get all referrals paginated
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} page query - Page number
 * @param  {Number} page_size query - Number of referrals per page
 *
 * @returns {object} Object containing the referrals retrieved and the total number of referrals
 *
 * @throws  {NotFound} If no referrals found
 * @throws  {InternalServerError} If any other error occurs
 *
 * @status  200 - On success
 * @status  404 - If no referrals found
 * @status  500 - On server error
 */
async function getReferralsPaginated(request, response, next) {
  try {
    const { count, rows } = await getModelPaginated(request.query, Referral);

    if (!rows.length) {
      return next(new HttpError.NotFound('No Referrals found'));
    }

    Logger.info(
      `Referral Controller - <${rows.length}> Referrals retrieved of <${count}> total`
    );
    response.status(200).json({ rows, count });
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/referral/chart?period=<string>&date=<ISO Date>
 * @desc   Get all referral entries by period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the referrals in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the referrals for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/referral/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function referralChartByPeriod(request, response, next) {
  const { period, date } = request.query;

  try {
    const data = await getSingleModelChartData(Referral, period, date);

    Logger.info(
      `Referral Controller - Referral chart by period - Period: <${
        period || 'd'
      }> - Date: <${date || new Date().toISOString().slice(0, 10)}>`
    );
    response.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export {
  addReferral,
  getReferral,
  updateReferral,
  deleteReferral,
  getReferralsPaginated,
  referralChartByPeriod
};
