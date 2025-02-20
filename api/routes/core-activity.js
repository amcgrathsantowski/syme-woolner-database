import { Router } from 'express';
import {
  addCoreActivity,
  getCoreActivity,
  getCoreActivitiesPaginated,
  getUpcomingCoreActivities,
  updateCoreActivity,
  deleteCoreActivity,
  coreActivityChartByPeriod,
  addCoreActivityParticipants,
  removeCoreActivityParticipants,
  getCoreActivityParticipantsPaginated
} from '../controllers/core-activity.js';

const coreActivityRouter = Router();

coreActivityRouter
  .route('/core-activity')
  .get(getCoreActivitiesPaginated)
  .post(addCoreActivity);

coreActivityRouter
  .route('/core-activity/upcoming')
  .get(getUpcomingCoreActivities);

coreActivityRouter.route('/core-activity/chart').get(coreActivityChartByPeriod);

coreActivityRouter
  .route('/core-activity/:id')
  .get(getCoreActivity)
  .put(updateCoreActivity)
  .delete(deleteCoreActivity);

coreActivityRouter
  .route('/core-activity/:id/participants')
  .get(getCoreActivityParticipantsPaginated)
  .post(addCoreActivityParticipants)
  .delete(removeCoreActivityParticipants);

export default coreActivityRouter;
