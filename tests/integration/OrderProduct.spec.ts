import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import faker from 'faker';

import createConnection from '../../src/shared/infra/typeorm/index';
import app from '../../src/shared/infra/http/app';
import factory from '../utils/factory';

interface ICustomer {
  name: string;
  email: string;
}

interface IProduct {
  name: string;
  price: number;
  quantity: number;
}

describe('OrderProduct', () => {
  let connection: Connection;
  const url = `http://127.0.0.1:3333/v1`;

  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS orders_products');
    await connection.query('DROP TABLE IF EXISTS orders');
    await connection.query('DROP TABLE IF EXISTS products');
    await connection.query('DROP TABLE IF EXISTS customers');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM orders_products');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM customers');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to get products from an order', async () => {
    const { name: customerName, email } = await factory.attrs<ICustomer>(
      'Customer',
    );
    const customer = await request(app)
      .post('/v1/customers')
      .send({ name: customerName, email });

    const { name: productName, price, quantity } = await factory.attrs<
      IProduct
    >('Product', { quantity: 2 });
    const product = await request(app)
      .post('/v1/products')
      .send({ name: productName, price, quantity });

    const order = await request(app)
      .post('/v1/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 1,
          },
        ],
      });

    const response = await request(app)
      .get(`/v1/orders/${order.body.id}/products`)
      .send();

    expect(response.body).toContainEqual(
      expect.objectContaining({
        name: productName,
        price: price.toFixed(2),
        quantity: 1,
        order_url: `${url}/orders/${order.body.id}`,
        url: `${url}/products/${product.body.id}`,
      }),
    );
  });

  it('should not be able to get products from an order that not exists', async () => {
    const uuid = faker.random.uuid();
    const response = await request(app)
      .get(`/v1/orders/${uuid}/products`)
      .expect(400)
      .send();

    expect(response.body).toStrictEqual({
      code: 247,
      message: 'Order not found',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });
});
