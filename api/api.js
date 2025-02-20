import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import multer from 'multer';

import {
  authRouter,
  adminRouter,
  mealRouter,
  clientRouter,
  selfRouter,
  harmReductionRouter,
  specialEventRouter,
  referralRouter,
  coreActivityRouter,
  projectActivityRouter,
  reportsRouter
} from './routes/index.js';
import {
  authenticateRole,
  LoggerMiddleware,
  PerformanceLoggerMiddleware,
  errorHandler
} from './middleware/index.js';
import { getNetworkIP, Logger, __dirname } from './utils/index.js';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(LoggerMiddleware);
app.use(PerformanceLoggerMiddleware);
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  Logger.debug('Using <Cors> for development');
  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
      ...getNetworkIP().map((ip) => `http://${ip}:3000`)
    ],
    credentials: true
  };
  app.use(cors(corsOptions));
}

// Authentication middleware
app.use('/api/admin', authenticateRole(['Admin']));
app.use('/api/employee', authenticateRole(['Admin', 'Employee']));

app.use(
  '/api/admin/database/restore',
  multer({ dest: join(__dirname, 'upload') }).single('file')
);

// User defined routes
app.use('/api', authRouter);

app.use('/api/admin', adminRouter);

app.use(
  '/api/employee',
  selfRouter,
  mealRouter,
  clientRouter,
  harmReductionRouter,
  specialEventRouter,
  referralRouter,
  coreActivityRouter,
  projectActivityRouter,
  reportsRouter
);

// Serve the React app
app.use(express.static(join(__dirname, 'public/dist')));
const reactClient = (request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.sendFile(join(__dirname, 'public/dist', 'index.html'));
};
app.get('*', reactClient);

app.use(errorHandler);

Logger.info('API server started');

export default app;
