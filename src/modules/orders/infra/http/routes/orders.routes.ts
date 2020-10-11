import { Router } from 'express';

import IdValidator from '@shared/infra/http/validators/IdValidator';
import OrdersController from '@modules/orders/infra/http/controller/OrdersController';
import OrderValidator from '@modules/orders/infra/http/validators/OrderValidator';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post('/', OrderValidator, ordersController.create);
ordersRouter.get('/:id', IdValidator, ordersController.show);

export default ordersRouter;
