import sequelize, { Op } from 'sequelize';
import {
  getChartPeriod,
  generateGroupedChartDatasets,
  generateSingleChartDatasets
} from '../utils/index.js';

/**
 * @param {sequelize.Model} Model The model to get the data from
 * @param {String} period The period to get the data for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to get the data for
 *
 * @note This function handles the data for the grouped models (e.g. SpecialEvent, Meal)
 *
 * @returns {Promise<{from: String, to: String, labels: String[], datasets: {label: String, data: Number[]}[]}>}
 */
async function getGroupedModelChartData(Model, period, date) {
  const { start, end, group_by, period: prd } = getChartPeriod(period, date);

  const data = await Model.findAll({
    attributes: [
      group_by
        ? [sequelize.fn(group_by, sequelize.col('date')), group_by]
        : 'date',
      'type',
      [
        sequelize.fn('sum', sequelize.col('number_of_clients')),
        'number_of_clients'
      ]
    ],
    group: [
      'type',
      group_by
        ? [sequelize.fn(group_by, sequelize.col('date')), group_by]
        : 'date'
    ],
    order: [
      [group_by ?? 'date', 'ASC'],
      ['type', 'ASC']
    ],
    where: {
      date: {
        [Op.gte]: start,
        [Op.lte]: end
      }
    }
  });

  const { labels, datasets } = generateGroupedChartDatasets(
    data,
    prd,
    start.toISOString().split('T')[0]
  );

  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0],
    labels,
    datasets
  };
}

/**
 * @param {sequelize.Model} Model The model to get the data from
 * @param {String} period The period to get the data for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to get the data for
 *
 * @note This function handles the data for the single models (e.g. HarmReduction, Referral)
 *
 * @returns {Promise<{from: String, to: String, labels: String[], datasets: {label: String, data: Number[]}[]}>}
 */
async function getSingleModelChartData(Model, period, date) {
  const { start, end, group_by, period: prd } = getChartPeriod(period, date);

  const data = await Model.findAll({
    attributes: [
      group_by
        ? [sequelize.fn(group_by, sequelize.col('date')), group_by]
        : 'date',
      [sequelize.fn('count', '*'), 'count']
    ],
    group: [
      group_by
        ? [sequelize.fn(group_by, sequelize.col('date')), group_by]
        : 'date'
    ],
    order: [[group_by ?? 'date', 'ASC']],
    where: {
      date: {
        [Op.gte]: start,
        [Op.lte]: end
      }
    }
  });

  const { labels, datasets } = generateSingleChartDatasets(
    data,
    prd,
    start.toISOString().split('T')[0]
  );

  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0],
    labels,
    datasets
  };
}

/**
 * @param {sequelize.Model} Model The model to get the data from
 * @param {String} period The period to get the data for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to get the data for
 *
 * @note This function handles the data for the bridged models (e.g. CoreActivity, ProjectActivity)
 *
 * @returns {Promise<{from: String, to: String, labels: String[], datasets: {label: String, data: Number[]}[]}>}
 */
async function getBridgeModelChartData(Model, period, date) {
  const { start, end, group_by, period: prd } = getChartPeriod(period, date);

  const data = await Model.findAll({
    attributes: [
      'type',
      group_by
        ? [sequelize.fn(group_by, sequelize.col('date')), group_by]
        : 'date',
      [
        sequelize.fn('sum', sequelize.col('number_of_clients')),
        'number_of_clients'
      ]
    ],
    group: [
      'type',
      group_by
        ? [sequelize.fn(group_by, sequelize.col('date')), group_by]
        : 'date'
    ],
    order: [[group_by ?? 'date', 'ASC']],
    where: {
      date: {
        [Op.gte]: start,
        [Op.lte]: end
      }
    }
  });

  const { labels, datasets } = generateGroupedChartDatasets(
    data,
    prd,
    start.toISOString().split('T')[0]
  );

  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0],
    labels,
    datasets
  };
}

export {
  getGroupedModelChartData,
  getSingleModelChartData,
  getBridgeModelChartData
};
