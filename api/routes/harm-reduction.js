import { Router } from 'express';
import {
  addHarmReduction,
  getHarmReduction,
  updateHarmReduction,
  deleteHarmReduction,
  getHarmReductionPaginated,
  harmReductionChartByPeriod
} from '../controllers/harm-reduction.js';

const harmReductionRouter = Router();

harmReductionRouter
  .route('/harm-reduction')
  .get(getHarmReductionPaginated)
  .post(addHarmReduction);

harmReductionRouter
  .route('/harm-reduction/chart')
  .get(harmReductionChartByPeriod);

harmReductionRouter
  .route('/harm-reduction/:id')
  .get(getHarmReduction)
  .put(updateHarmReduction)
  .delete(deleteHarmReduction);

export default harmReductionRouter;
