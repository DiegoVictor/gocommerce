import { Router } from 'express';

import CustomersController from '@modules/customers/infra/http/controller/CustomersController';
import CustomerValidator from '@modules/customers/infra/http/validators/CustomerValidator';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post('/', CustomerValidator, customersController.create);

export default customersRouter;
