import { Router } from 'express';
import {
  addClient,
  getClient,
  updateClient,
  deleteClient,
  getClientsPaginated
} from '../controllers/client.js';

const clientRouter = Router();

clientRouter.route('/client').get(getClientsPaginated).post(addClient);

clientRouter
  .route('/client/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

export default clientRouter;
