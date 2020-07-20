import { Router } from 'express';

import ProductsController from '../controller/ProductsController';
import ProductValidator from '../validators/ProductValidator';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('/', ProductValidator, productsController.create);

export default productsRouter;
