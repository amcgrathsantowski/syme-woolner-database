import { DateTime } from 'luxon';

/**
 * Get the start and end dates and grouping type for a chart period
 *
 * @param {String} period The period to get the data for (day - d, week - w, month - m, quarter - q, year - y)
 * @param {Date} date The date to get the data for
 *
 * @returns {{start: Date, end: Date, group_by: String, period: String}}
 */
export default function getChartPeriod(period, date) {
  if (!period) period = 'd';
  let group_by = null;

  const date_valid = DateTime.fromFormat(date ?? '', 'yyyy-mm-dd').isValid;
  const date_obj = date_valid ? new Date(date) : new Date();

  date_obj.setTime(
    date_obj.getTime() + date_obj.getTimezoneOffset() * 60 * 1000
  );
  if (period !== 'd') {
    date_obj.setMonth(0);
    date_obj.setDate(1);
  }

  switch (period.toLowerCase()) {
    case 'd':
    case 'day':
      period = 'd';
      date_obj.setDate(date_obj.getDate() - 6);
      group_by = null;
      break;
    case 'w':
    case 'week':
      period = 'w';
      group_by = 'week';
      break;
    case 'm':
    case 'month':
      period = 'm';
      group_by = 'month';
      break;
    case 'q':
    case 'quarter':
      period = 'q';
      group_by = 'month';
      break;
    case 'y':
    case 'year':
      period = 'y';
      date_obj.setFullYear(1996);
      group_by = 'year';
      break;
    default:
      // Default to day
      period = 'd';
      date_obj.setDate(date_obj.getDate() - 6);
      group_by = null;
      break;
  }
  const end = period === 'y' ? new Date() : new Date(date_obj);
  if (period === 'd') {
    end.setDate(end.getDate() + 6);
  } else {
    end.setFullYear(end.getFullYear() + 1);
    // set the date to the last day of the previous month (last day of the specified year in this case)
    end.setDate(0);
  }

  return {
    start: date_obj,
    end,
    group_by,
    period
  };
}
