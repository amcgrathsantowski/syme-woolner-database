import { Router } from 'express';
import {
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  validatePasswordTokenState
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.route('/login').post(login);

authRouter.route('/refresh').get(refresh);

authRouter.route('/logout').get(logout);

authRouter.route('/forgot-password').get(forgotPassword);
authRouter.route('/validate-password-token').get(validatePasswordTokenState);
authRouter.route('/reset-password').post(resetPassword);

export default authRouter;
