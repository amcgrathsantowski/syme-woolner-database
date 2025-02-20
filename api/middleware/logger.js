import { config } from 'dotenv';
import expressWinston from 'express-winston';
import morgan from 'morgan';
import { RequestLogger, PerformanceLogger } from '../utils/index.js';

/**
 * Middleware to log all incoming requests
 */
config();
if (process.env.NODE_ENV === 'development') {
  expressWinston.requestWhitelist.push('body');
}
const LoggerMiddleware = expressWinston.logger({
  winstonInstance: RequestLogger,
  statusLevels: true
});

const PerformanceLoggerMiddleware = morgan('dev', {
  stream: PerformanceLogger.stream
});

export { LoggerMiddleware, PerformanceLoggerMiddleware };
