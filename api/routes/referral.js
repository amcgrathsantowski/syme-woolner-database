import { Router } from 'express';
import {
  addReferral,
  getReferral,
  updateReferral,
  deleteReferral,
  getReferralsPaginated,
  referralChartByPeriod
} from '../controllers/referral.js';

const referralRouter = Router();

referralRouter.route('/referral').get(getReferralsPaginated).post(addReferral);

referralRouter.route('/referral/chart').get(referralChartByPeriod);

referralRouter
  .route('/referral/:id')
  .get(getReferral)
  .put(updateReferral)
  .delete(deleteReferral);

export default referralRouter;
