import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FindCustomerService from '@modules/customers/services/FindCustomerService';

export default class CustomersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { currentUrl } = request;
    const { id } = request.params;

    const findCustomer = container.resolve(FindCustomerService);
    const customer = await findCustomer.execute({ id });

    return response.json({
      ...customer,
      url: currentUrl,
    });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);
    const customer = await createCustomer.execute({ name, email });

    return response.json(customer);
  }
}
