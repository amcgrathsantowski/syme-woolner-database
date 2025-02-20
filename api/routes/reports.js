import { Router } from 'express';
import {
  getAnnualClientCount,
  getClientCountCharts
} from '../controllers/reports.js';

const reportsRouter = Router();

reportsRouter.route('/reports/client-count').get(getAnnualClientCount);

reportsRouter.route('/reports/client-count/chart').get(getClientCountCharts);

export default reportsRouter;
