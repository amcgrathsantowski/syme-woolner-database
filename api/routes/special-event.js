import { Router } from 'express';
import {
  addSpecialEvent,
  getSpecialEvent,
  updateSpecialEvent,
  deleteSpecialEvent,
  getSpecialEventsPaginated,
  specialEventChartByPeriod,
  getUpcomingSpecialEvents
} from '../controllers/special-event.js';

const specialEventRouter = Router();

specialEventRouter
  .route('/special-event')
  .get(getSpecialEventsPaginated)
  .post(addSpecialEvent);

specialEventRouter
  .route('/special-event/upcoming')
  .get(getUpcomingSpecialEvents);

specialEventRouter.route('/special-event/chart').get(specialEventChartByPeriod);

specialEventRouter
  .route('/special-event/:id')
  .get(getSpecialEvent)
  .put(updateSpecialEvent)
  .delete(deleteSpecialEvent);

export default specialEventRouter;
