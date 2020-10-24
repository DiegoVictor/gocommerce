import { Router } from 'express';

import IdValidator from '@shared/infra/http/validators/IdValidator';
import OrdersController from '@modules/orders/infra/http/controller/OrdersController';
import OrderProductsController from '@modules/orders/infra/http/controller/OrderProductsController';
import OrderValidator from '@modules/orders/infra/http/validators/OrderValidator';

const ordersRouter = Router();
const ordersController = new OrdersController();
const orderProductsController = new OrderProductsController();

ordersRouter.post('/', OrderValidator, ordersController.create);
ordersRouter.get('/:id', IdValidator, ordersController.show);
ordersRouter.get('/:id/products', IdValidator, orderProductsController.index);

export default ordersRouter;
