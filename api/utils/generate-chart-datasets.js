import { getQuarterFromNumeric } from './date-functions.js';

// Used for mapping the months to their numeric value
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/**
 * @param {String} period The period to generate the labels for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to start the labels from
 * @param {Array<number>} unique_years Optional array of unique years to use for the labels
 *
 * @note The date parameter is only used for the day period, for all other periods it uses the year parameter of the date
 *
 * @returns {Array<String>} The generated labels
 */
function generateLabels(period, date, unique_years = []) {
  const date_copy = new Date(date);
  date_copy.setTime(
    date_copy.getTime() + date_copy.getTimezoneOffset() * 60 * 1000
  );
  const labels = [];
  const year = date_copy.getFullYear();

  switch (period) {
    case 'd':
      for (let i = 0; i < 7; i++) {
        labels.push(
          date_copy.toDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        );
        date_copy.setDate(date_copy.getDate() + 1);
      }
      break;
    case 'w':
      for (let i = 0; i < 52; i++) {
        labels.push(`Week ${i + 1} ${year}`);
      }
      break;
    case 'm':
      for (let i = 0; i < 12; i++) {
        labels.push(`${months[i]} ${year}`);
      }
      break;
    case 'q':
      for (let i = 0; i < 4; i++) {
        labels.push(`Q${i + 1} ${year}`);
      }
      break;
    case 'y':
      labels.push(...unique_years);
      break;
    default:
      for (let i = 0; i < 7; i++) {
        labels.push(
          date_copy.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        );
        date_copy.setDate(date_copy.getDate() + 1);
      }
  }
  return labels;
}

/**
 * @param {Array<sequelize.Model>} data The data to generate the datasets from
 * @param {String} type Type of data to generate the datasets for, used for variation in the data for grouped models
 * @param {String} period The period to generate the datasets for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to start the datasets from
 * @param {Array<number>} unique_years Optional array of unique years to use for matching the data to the correct index
 *
 * @note This function handles the data for the grouped and bridged models (e.g. SpecialEvent, Meal, CoreActivity, ProjectActivity)
 *
 * @returns {Array<Array<number>>} The generated datasets
 */
function generateGroupedDatasets(data, type, period, date, unique_years = []) {
  const date_copy = new Date(date);
  const filtered = data.filter((d) => d.type === type);
  const dataset = [];

  switch (period) {
    case 'd':
      for (let i = 0, j = 0; i < 7; ++i) {
        const record_date = new Date(filtered[j]?.date);
        if (
          date_copy.toLocaleDateString() === record_date.toLocaleDateString()
        ) {
          dataset.push(parseInt(filtered[j].number_of_clients, 10));
          if (j < filtered.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
        date_copy.setDate(date_copy.getDate() + 1);
      }
      break;
    case 'w':
      for (let i = 0, j = 0; i < 52; ++i) {
        if (filtered[j].getDataValue('week') === i + 1) {
          dataset.push(parseInt(filtered[j].number_of_clients, 10));
          if (j < filtered.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
      }
      break;
    case 'm':
      for (let i = 0, j = 0; i < 12; ++i) {
        if (filtered[j].getDataValue('month') === i + 1) {
          dataset.push(parseInt(filtered[j].number_of_clients, 10));
          if (j < filtered.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
      }
      break;
    case 'q':
      dataset.push(0, 0, 0, 0);
      filtered.forEach((d) => {
        const m = d.getDataValue('month');
        const q = getQuarterFromNumeric(m);
        dataset[q - 1] += parseInt(d.number_of_clients, 10);
      });
      break;
    case 'y':
      for (let i = 0, j = 0; i < unique_years.length; ++i) {
        if (filtered[j].getDataValue('year') === unique_years[i]) {
          dataset.push(parseInt(filtered[j].number_of_clients, 10));
          if (j < filtered.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
      }
      break;
    default:
      for (let i = 0, j = 0; i < 7; ++i) {
        const record_date = new Date(filtered[j]?.date);
        if (
          date_copy.toLocaleDateString() === record_date.toLocaleDateString()
        ) {
          dataset.push(parseInt(filtered[j].number_of_clients, 10));
          if (j < filtered.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
        date_copy.setDate(date_copy.getDate() + 1);
      }
  }
  return dataset;
}

/**
 * @param {Array<sequelize.Model>} data The data to generate the datasets from
 * @param {String} type Type of data to generate the datasets for, used for variation in the data for grouped models
 * @param {String} period The period to generate the datasets for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to start the datasets from
 * @param {Array<number>} unique_years Optional array of unique years to use for matching the data to the correct index
 *
 * @note This function handles the data for the single models (e.g. HarmReduction, Referral)
 *
 * @returns {Array<Array<number>>} The generated datasets
 */
function generateSingleDatasets(data, period, date, unique_years = []) {
  const date_copy = new Date(date);
  const dataset = [];
  switch (period) {
    case 'd':
      for (let i = 0, j = 0; i < 7; ++i) {
        const record_date = new Date(data[j]?.date);
        if (
          date_copy.toLocaleDateString() === record_date.toLocaleDateString()
        ) {
          dataset.push(parseInt(data[j].getDataValue('count'), 10));
          if (j < data.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
        date_copy.setDate(date_copy.getDate() + 1);
      }
      break;
    case 'w':
      for (let i = 0, j = 0; i < 52; ++i) {
        if (data[j].getDataValue('week') === i + 1) {
          dataset.push(parseInt(data[j].getDataValue('count'), 10));
          if (j < data.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
      }
      break;
    case 'm':
      for (let i = 0, j = 0; i < 12; ++i) {
        if (data[j].getDataValue('month') === i + 1) {
          dataset.push(parseInt(data[j].getDataValue('count'), 10));
          if (j < data.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
      }
      break;
    case 'q':
      dataset.push(0, 0, 0, 0);
      data.forEach((d) => {
        const m = d.getDataValue('month');
        const q = getQuarterFromNumeric(m);
        dataset[q - 1] += parseInt(d.getDataValue('count'), 10);
      });
      break;
    case 'y':
      for (let i = 0, j = 0; i < unique_years.length; ++i) {
        if (data[j].getDataValue('year') === unique_years[i]) {
          dataset.push(parseInt(data[j].getDataValue('count'), 10));
          if (j < data.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
      }
      break;
    default:
      for (let i = 0, j = 0; i < 7; ++i) {
        const record_date = new Date(data[j]?.date);
        if (
          date_copy.toLocaleDateString() === record_date.toLocaleDateString()
        ) {
          dataset.push(parseInt(data[j].getDataValue('count'), 10));
          if (j < data.length - 1) j += 1;
        } else {
          dataset.push(0);
        }
        date_copy.setDate(date_copy.getDate() + 1);
      }
  }
  return dataset;
}

/**
 * Generates the labels datasets for the grouped and bridged models (e.g. SpecialEvent, Meal, CoreActivity, ProjectActivity)
 * Uses chart.js formatting for the datasets and labels
 *
 * @param {Array<Object>} data Data to generate the chart sets from
 * @param {String} period The period to generate the datasets for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to start the datasets from
 *
 * @returns {{from: Date, to: Date, labels: Array<String>, datasets, Array<Object>}} The generated datasets and labels
 */
function generateGroupedChartDatasets(data, period, date) {
  const types = [...new Set(data.map((d) => d.type))];

  let unique_years = [];
  if (period === 'y')
    unique_years = [...new Set(data.map((d) => d.getDataValue('year')))];
  const labels = generateLabels(period, date, unique_years);

  const datasets = types.map((type) => ({
    label: type,
    data: generateGroupedDatasets(data, type, period, date, unique_years)
  }));

  return { datasets, labels };
}

/**
 * Generates the labels datasets for the single models (e.g. HarmReduction, Referral)
 * Uses chart.js formatting for the datasets and labels
 *
 * @param {Array<Object>} data Data to generate the chart sets from
 * @param {String} period The period to generate the datasets for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to start the datasets from
 *
 * @returns {{from: Date, to: Date, labels: Array<String>, datasets, Array<Object>}} The generated datasets and labels
 */
function generateSingleChartDatasets(data, period, date) {
  let unique_years = [];
  if (period === 'y')
    unique_years = [...new Set(data.map((d) => d.getDataValue('year')))];
  const labels = generateLabels(period, date, unique_years);

  const datasets = [
    {
      data: generateSingleDatasets(data, period, date, unique_years)
    }
  ];

  return { datasets, labels };
}

export { generateGroupedChartDatasets, generateSingleChartDatasets };
