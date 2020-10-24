import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', { code: 144 }, 404);
    }

    return customer;
  }
}

export default FindCustomerService;
