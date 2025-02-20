import { Router } from 'express';
import { updateSelf, updateSelfPassword } from '../controllers/self.js';

const selfRouter = Router();

selfRouter.route('/self').put(updateSelf);

selfRouter.route('/self/password').put(updateSelfPassword);

export default selfRouter;
