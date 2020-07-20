import { Router } from 'express';

import CustomersController from '../controller/CustomersController';
import CustomerValidator from '../validators/CustomerValidator';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post('/', CustomerValidator, customersController.create);

export default customersRouter;
