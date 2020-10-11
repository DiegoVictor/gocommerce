import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { current_url, host_url } = request;
    const { id } = request.params;

    const findOrder = container.resolve(FindOrderService);
    const order = await findOrder.execute({ id });

    return response.json({
      ...order,
      customer: {
        ...order.customer,
        url: `${host_url}/v1/customers/${order.customer_id}`,
      },
      order_products: order.order_products.map(product => ({
        ...product,
        url: `${host_url}/v1/products/${product.id}`,
      })),
      products_url: `${host_url}/v1/orders/${order.id}/products`,
      url: current_url,
    });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrder = container.resolve(CreateOrderService);
    const order = await createOrder.execute({ customer_id, products });

    return response.json(order);
  }
}
