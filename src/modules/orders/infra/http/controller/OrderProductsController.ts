import { Request, Response } from 'express';
import { container } from 'tsyringe';

import FindOrderProductsService from '@modules/orders/services/FindOrderProductsService';

export default class OrderProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { hostUrl } = request;
    const { id } = request.params;

    const findOrderProducts = container.resolve(FindOrderProductsService);
    const products = await findOrderProducts.execute({ order_id: id });

    return response.json(
      products.map(product => ({
        ...product,
        name: product.product.name,
        order_url: `${hostUrl}/v1/orders/${id}`,
        url: `${hostUrl}/v1/products/${product.product.id}`,
      })),
    );
  }
}
