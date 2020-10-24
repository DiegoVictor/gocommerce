import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

interface IRequest {
  order_id: string;
}

@injectable()
class FindOrderProductsService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({ order_id }: IRequest): Promise<OrdersProducts[]> {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new AppError('Order not found', { code: 247 });
    }

    return order.order_products;
  }
}

export default FindOrderProductsService;
