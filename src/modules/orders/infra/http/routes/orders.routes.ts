import { Router } from 'express';

import OrdersController from '../controller/OrdersController';
import OrderValidator from '../validators/OrderValidator';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post('/', OrderValidator, ordersController.create);
ordersRouter.get('/:id', ordersController.show);

export default ordersRouter;
