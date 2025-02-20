import { Router } from 'express';
import {
  addProjectActivity,
  getProjectActivity,
  getProjectActivitiesPaginated,
  getUpcomingProjectActivities,
  updateProjectActivity,
  deleteProjectActivity,
  projectActivityChartByPeriod,
  addProjectActivityParticipants,
  removeProjectActivityParticipants,
  getProjectActivityParticipantsPaginated
} from '../controllers/project-activity.js';

const projectActivityRouter = Router();

projectActivityRouter
  .route('/project-activity')
  .get(getProjectActivitiesPaginated)
  .post(addProjectActivity);

projectActivityRouter
  .route('/project-activity/upcoming')
  .get(getUpcomingProjectActivities);

projectActivityRouter
  .route('/project-activity/chart')
  .get(projectActivityChartByPeriod);

projectActivityRouter
  .route('/project-activity/:id')
  .get(getProjectActivity)
  .put(updateProjectActivity)
  .delete(deleteProjectActivity);

projectActivityRouter
  .route('/project-activity/:id/participants')
  .get(getProjectActivityParticipantsPaginated)
  .post(addProjectActivityParticipants)
  .delete(removeProjectActivityParticipants);

export default projectActivityRouter;
