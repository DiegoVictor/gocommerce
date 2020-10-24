import { Router } from 'express';

import IdValidator from '@shared/infra/http/validators/IdValidator';
import ProductsController from '@modules/products/infra/http/controller/ProductsController';
import ProductValidator from '@modules/products/infra/http/validators/ProductValidator';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('/', ProductValidator, productsController.create);
productsRouter.get('/:id', IdValidator, productsController.show);

export default productsRouter;
