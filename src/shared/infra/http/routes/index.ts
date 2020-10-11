import { Router } from 'express';

import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import RateLimit from '@shared/infra/http/middlewares/RateLimit';

const routes = Router();

routes.use(RateLimit);

routes.use('/customers', customersRouter);
routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);

export default routes;
