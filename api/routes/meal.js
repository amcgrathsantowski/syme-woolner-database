import { Router } from 'express';
import {
  addMeal,
  getMeal,
  getMealsPaginated,
  updateMeal,
  deleteMeal,
  mealChartByPeriod
} from '../controllers/meal.js';

const mealRouter = Router();

mealRouter.route('/meal').get(getMealsPaginated).post(addMeal);

mealRouter.route('/meal/chart').get(mealChartByPeriod);

mealRouter.route('/meal/:id').get(getMeal).put(updateMeal).delete(deleteMeal);

export default mealRouter;
