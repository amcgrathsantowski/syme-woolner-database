import { Router } from 'express';
import {
  registerEmployee,
  getEmployee,
  updateEmployee,
  resetEmployeePassword,
  deleteEmployee,
  getEmployeesPaginated,
  getDatabaseBackup,
  restoreDatabaseFromBackup
} from '../controllers/admin.js';

const adminRouter = Router();

adminRouter
  .route('/employee')
  .get(getEmployeesPaginated)
  .post(registerEmployee);

adminRouter
  .route('/employee/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

adminRouter.route('/employee/:id/password').get(resetEmployeePassword);

adminRouter.route('/database/backup').get(getDatabaseBackup);

adminRouter.route('/database/restore').post(restoreDatabaseFromBackup);

export default adminRouter;
