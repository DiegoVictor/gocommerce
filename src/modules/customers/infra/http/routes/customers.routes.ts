import { Router } from 'express';

import CustomersController from '@modules/customers/infra/http/controller/CustomersController';
import CustomerValidator from '@modules/customers/infra/http/validators/CustomerValidator';
import IdValidator from '@shared/infra/http/validators/IdValidator';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post('/', CustomerValidator, customersController.create);
customersRouter.get('/:id', IdValidator, customersController.show);

export default customersRouter;
