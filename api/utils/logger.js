import { config } from 'dotenv';
import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import { __dirname } from './filesystem.js';
import 'winston-daily-rotate-file';

config();
const DEV = process.env.NODE_ENV === 'development';

/**
 * Winston logger for Morgan style logging
 * Retains logs for 60 days with a maximum size of 50MB
 * Uses compression to save space
 * The logger uses a custom format to log the timestamp, level and message
 * Useful for performance logging and debugging
 */
const performance_transport_list = [
  new transports.DailyRotateFile({
    filename: join(
      __dirname,
      'logs',
      `performance-%DATE%${DEV ? '.dev' : ''}.log`
    ),
    level: 'info',
    handleExceptions: true,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '60d',
    colorize: false,
    format: format.printf(({ message }) => {
      // Remove ANSI color codes from the message
      // eslint-disable-next-line no-control-regex
      const msg = message.slice(0, -1).replace(/\x1b[^m]*(?:m|$)/g, '');
      return `Performance::${msg}`;
    })
  }),
  new transports.Console({
    level: 'debug',
    handleExceptions: true,
    colorize: true,
    format: format.combine(
      format.printf(({ message }) => `Performance - ${message.slice(0, -2)}`),
      format.colorize()
    )
  })
];

/**
 * Winston logger for internal Event logging
 * Retains logs for 60 days with a maximum size of 50MB
 * Uses compression to save space
 * The logger uses a custom format to log the timestamp, level and message
 * Useful for basic logging and debugging
 */
const default_transport_list = [
  new transports.DailyRotateFile({
    filename: join(__dirname, 'logs', `event-%DATE%${DEV ? '.dev' : ''}.log`),
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '60d'
  }),
  new transports.Console({
    level: 'silly',
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(
        ({ level, message, timestamp }) =>
          `Event - ${timestamp} ${level}: ${message}`
      )
    )
  })
];

const query_transport_list = [
  new transports.DailyRotateFile({
    filename: join(__dirname, 'logs', `query-%DATE%${DEV ? '.dev' : ''}.log`),
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '60d'
  }),
  new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.printf(
        ({ message, timestamp }) => `Query - ${timestamp}: ${message}`
      )
    )
  })
];

/**
 * Winston logger for API Request logging
 * Retains logs for 60 days with a maximum size of 50MB
 * Uses compression to save space
 * The logger uses json format to log the timestamp, level, message and metadata of the request
 * Useful for advanced logging, debugging, and analytics
 */
const request_transport_list = [
  new transports.DailyRotateFile({
    filename: join(
      __dirname,
      'logs',
      `api-info-%DATE%${DEV ? '.dev' : ''}.log`
    ),
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '60d'
  })
];

// Default Logger format for event logging
const default_format = format.combine(
  format.timestamp(),
  format.printf(
    ({ level, message, timestamp }) =>
      `Event::${timestamp}::${level}::${message}`
  )
);

// Database query Logger format to register database queries
const query_format = format.combine(
  format.timestamp(),
  format.printf(({ message, timestamp }) => `Query::${timestamp}::${message}`)
);

// API request Logger format to register incoming API calls in logs
const format_list = [format.json(), format.timestamp(), format.metadata()];
if (DEV) {
  format_list.push(format.prettyPrint());
}
const request_format = format.combine(...format_list);

let Logger;
if (!Logger)
  Logger = createLogger({
    format: default_format,
    transports: default_transport_list
  });
let RequestLogger;
if (!RequestLogger)
  RequestLogger = createLogger({
    format: request_format,
    transports: request_transport_list
  });
let QueryLogger;
if (!QueryLogger)
  QueryLogger = createLogger({
    format: query_format,
    transports: query_transport_list
  });

let PerformanceLogger;
if (!PerformanceLogger) {
  PerformanceLogger = createLogger({
    transports: performance_transport_list,
    exitOnError: false
  });

  PerformanceLogger.stream = {
    write: function (message) {
      PerformanceLogger.info(message);
    }
  };
}

export { Logger, RequestLogger, QueryLogger, PerformanceLogger };
