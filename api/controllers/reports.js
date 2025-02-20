import sequelize, { Op } from 'sequelize';
import {
  Client,
  Meal,
  SpecialEvent,
  Referral,
  HarmReduction,
  CoreActivity,
  ProjectActivity,
  ProjectActivityParticipants,
  CoreActivityParticipants
} from '../database/models/index.js';
import {
  getGroupedModelChartData,
  getSingleModelChartData,
  getBridgeModelChartData
} from '../services/index.js';
import { Logger } from '../utils/index.js';

/**
 * @method GET
 * @route  /api/employee/reports/client-count?year=<year>
 * @desc   Get client count statistics for a given year
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {Number} year query - Year to get statistics for
 *
 * @returns {object} Client count statistics
 *
 * @throws  {InternalServerError} If any error occurs
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function getAnnualClientCount(request, response, next) {
  let { year } = request.query;
  year = year ? parseInt(year, 10) : new Date().getFullYear();

  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  const where = {
    date: {
      [Op.gte]: start,
      [Op.lte]: end
    }
  };
  const attributes = [
    [
      sequelize.fn('sum', sequelize.col('number_of_clients')),
      'number_of_clients'
    ]
  ];

  try {
    const { count: new_client_count } = await Client.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: start,
          [Op.lte]: end
        }
      }
    });

    const { rows: referral_rows, count: referral_count } =
      await Referral.findAndCountAll({ where });

    const { rows: harm_reduction_rows, count: harm_reduction_count } =
      await HarmReduction.findAndCountAll({ where });

    const [meal_data] = await Meal.findAll({
      attributes,
      where
    });
    const meal_count = parseInt(meal_data.number_of_clients, 10) || 0;

    const [special_event_data] = await SpecialEvent.findAll({
      attributes,
      where
    });
    const special_event_count =
      parseInt(special_event_data.number_of_clients, 10) || 0;

    const [core_activity_data] = await CoreActivity.findAll({
      attributes,
      where
    });
    const core_activity_count =
      parseInt(core_activity_data.number_of_clients, 10) || 0;

    const [project_activity_data] = await ProjectActivity.findAll({
      attributes,
      where
    });
    const project_activity_count =
      parseInt(project_activity_data.number_of_clients, 10) || 0;

    const unique_ids = new Set();

    let unique_referral_count = 0;
    let unique_harm_reduction_count = 0;
    referral_rows.forEach((row) => {
      if (row.id) unique_ids.add(row.id);
      else unique_referral_count += 1;
    });
    harm_reduction_rows.forEach((row) => {
      if (row.client_id) unique_ids.add(row.client_id);
      else unique_harm_reduction_count += 1;
    });

    const unique_project_activity_data = await ProjectActivity.findAll({
      include: [
        {
          attributes: ['client_id'],
          model: ProjectActivityParticipants
        }
      ],
      where
    });

    unique_project_activity_data.forEach((row) =>
      row.project_activity_participants.forEach((participant) =>
        unique_ids.add(participant.client_id)
      )
    );

    const unique_core_activity_data = await CoreActivity.findAll({
      include: [
        {
          attributes: ['client_id'],
          model: CoreActivityParticipants
        }
      ],
      where
    });

    unique_core_activity_data.forEach((row) =>
      row.core_activity_participants.forEach((participant) =>
        unique_ids.add(participant.client_id)
      )
    );

    Logger.info(
      `Reports Controller - Client count for year <${year}> retrieved`
    );

    const count_data = {
      year,
      total_clients:
        harm_reduction_count +
        meal_count +
        special_event_count +
        core_activity_count +
        project_activity_count,

      new_clients: new_client_count,
      unique_clients:
        unique_harm_reduction_count + unique_ids.size
    };

    response.status(200).json(count_data);
  } catch (err) {
    next(err);
  }
}

/**
 * @method GET
 * @route  /api/employee/reports/client-count/chart?period=<string>&date=<ISO Date>
 * @desc   Get total client count statistics for a given period
 * @access Private
 * @roles  Admin, Employee
 * @type   Controller
 * @data   JSON
 *
 * @param  {String} period query - Period form to get the total client count in (day - d , week - w, month - m, year - y)
 * @note   If no period is provided, the default day period is used,
 * the day format returns the last 7 days specified by the date query,
 * the week format will return all data in the specified year grouped by week,
 * the month format will return all data in the specified year grouped by month,
 * the quarter format will return all data in the specified year grouped by quarter,
 * the year format will return all data from beginning of time grouped by year
 * @param  {Date} date query - Date to get the referrals for
 * @note   The date must match the ISO standard date, "yyyy-mm-dd", if no date is provided or the date does not match the ISO standard, the current date is used
 * @example /api/employee/reports/client-count/chart?period=day&date=2021-01-01
 *
 * @returns {object} Object containing the labels and datasets for the chart
 *
 * @status  200 - On success
 * @status  500 - On server error
 */
async function getClientCountCharts(request, response, next) {
  const { period, date } = request.query;

  try {
    const referral_data = await getSingleModelChartData(Referral, period, date);

    const harm_reduction_data = await getSingleModelChartData(
      HarmReduction,
      period,
      date
    );

    const meal_data = await getGroupedModelChartData(Meal, period, date);

    const special_event_data = await getGroupedModelChartData(
      SpecialEvent,
      period,
      date
    );

    const core_activity_data = await getBridgeModelChartData(
      CoreActivity,
      period,
      date
    );

    const project_activity_data = await getBridgeModelChartData(
      ProjectActivity,
      period,
      date
    );

    const labels = referral_data.labels;
    const size = labels.length;

    const data_to_merge = [
      referral_data.datasets,
      harm_reduction_data.datasets,
      meal_data.datasets,
      special_event_data.datasets,
      core_activity_data.datasets,
      project_activity_data.datasets
    ];

    const merged_data = [];

    for (let i = 0; i < size; i++) {
      merged_data.push(0);
    }

    data_to_merge.forEach((datasets) => {
      datasets.forEach((dataset) => {
        dataset.data.forEach((value, index) => {
          merged_data[index] += parseInt(value, 10);
        });
      });
    });

    Logger.info(
      `Reports Controller - Client count charts for period <${
        period || 'd'
      }> - Date: <${date || new Date().toISOString().slice(0, 10)}>`
    );
    response.status(200).json({ labels, datasets: [{ data: merged_data }] });
  } catch (err) {
    next(err);
  }
}

export { getAnnualClientCount, getClientCountCharts };
