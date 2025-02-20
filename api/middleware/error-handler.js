import HttpError from 'http-errors';
import { Logger } from '../utils/index.js';

/**
 * Error handler middleware to handle all errors thrown by the API and avoid application crash
 * @param {HttpError.HttpError | Error} error An instance of Error thrown by the API
 * @param {*} request Express request object
 * @param {*} response Express response object
 * @param {*} next Express next function
 */
function errorHandler(error, request, response, next) {
  try {
    // If the error is an instance of HttpError, return the error message
    if (error instanceof HttpError.HttpError) {
      Logger.error(`HTTP-Error - <${error.status}> ${error.message}`);
      return response.status(error.status).json({ error: error.message });
    } else Logger.error(`UNKNOWN-Error - ${error.message}`);
  } catch (err) {
    // If the error is not trapped by the above condition, log the error message as critical
    Logger.error(`UNKNOWN-Error-Critical - ${err.message}`);
  }
  // Return the default response
  response.status(500).json({ error: 'Server Error' });
}

export default errorHandler;
