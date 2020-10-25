import request from 'supertest';
import { Connection, getConnection, getRepository } from 'typeorm';
import faker from 'faker';

import createConnection from '../../src/shared/infra/typeorm/index';
import Product from '../../src/modules/products/infra/typeorm/entities/Product';
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

jest.mock('../../src/shared/config/security', () => ({
  duration: 1,
  points: 20,
}));

describe('Order', () => {
  let connection: Connection;

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

  it('should be able to create a new order', async () => {
    const { name: productName, price, quantity } = await factory.attrs<
      IProduct
    >('Product', { quantity: 5 });
    const product = await request(app)
      .post('/v1/products')
      .send({ name: productName, price, quantity });

    const { name: customerName, email } = await factory.attrs<ICustomer>(
      'Customer',
    );
    const customer = await request(app).post('/v1/customers').send({
      name: customerName,
      email,
    });

    const response = await request(app)
      .post('/v1/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity,
          },
        ],
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: customer.body.id,
          name: customerName,
          email,
        }),
        order_products: expect.arrayContaining([
          expect.objectContaining({
            product_id: product.body.id,
            price: price.toFixed(2),
            quantity,
          }),
        ]),
      }),
    );
  });

  it('should not be able to create an order with a invalid customer', async () => {
    const uuid = faker.random.uuid();
    const response = await request(app).post('/v1/orders').expect(400).send({
      customer_id: uuid,
    });

    expect(response.body).toStrictEqual({
      code: 245,
      message: 'Customer not found',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to create an order with invalid products', async () => {
    const { name: customerName, email } = await factory.attrs<ICustomer>(
      'Customer',
    );
    const customer = await request(app).post('/v1/customers').send({
      name: customerName,
      email,
    });
    const uuid = faker.random.uuid();

    const response = await request(app)
      .post('/v1/orders')
      .expect(400)
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: uuid,
            quantity: 1,
          },
        ],
      });

    expect(response.body).toStrictEqual({
      code: 246,
      message: 'Product not found',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to create an order with products with insufficient quantities', async () => {
    const { name: customerName, email } = await factory.attrs<ICustomer>(
      'Customer',
    );
    const customer = await request(app).post('/v1/customers').send({
      name: customerName,
      email,
    });

    const { name: productName, price, quantity } = await factory.attrs<
      IProduct
    >('Product', { quantity: 5 });
    const product = await request(app).post('/v1/products').send({
      name: productName,
      price,
      quantity,
    });

    const response = await request(app)
      .post('/v1/orders')
      .expect(400)
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: quantity + 1,
          },
        ],
      });

    expect(response.body).toStrictEqual({
      code: 240,
      message: 'There is not enough product quantity in stock',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to subtract an product total quantity when it is ordered', async () => {
    const productsRepository = getRepository(Product);

    const { name: customerName, email } = await factory.attrs<ICustomer>(
      'Customer',
    );
    const customer = await request(app).post('/v1/customers').send({
      name: customerName,
      email,
    });

    const { name: productName, price, quantity } = await factory.attrs<
      IProduct
    >('Product', { quantity: 15 });
    const product = await request(app).post('/v1/products').send({
      name: productName,
      price,
      quantity,
    });

    await request(app)
      .post('/v1/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    let foundProduct = await productsRepository.findOne(product.body.id);

    expect(foundProduct).toEqual(
      expect.objectContaining({
        quantity: quantity - 5,
      }),
    );

    await request(app)
      .post('/v1/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    foundProduct = await productsRepository.findOne(product.body.id);

    expect(foundProduct).toEqual(
      expect.objectContaining({
        quantity: quantity - 10,
      }),
    );
  });

  it('should be able to list one specific order', async () => {
    const { name: customerName, email } = await factory.attrs<ICustomer>(
      'Customer',
    );
    const customer = await request(app).post('/v1/customers').send({
      name: customerName,
      email,
    });

    const { name: productName, price, quantity } = await factory.attrs<
      IProduct
    >('Product', { quantity: 10 });
    const product = await request(app).post('/v1/products').send({
      name: productName,
      price,
      quantity,
    });

    const order = await request(app)
      .post('/v1/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    const response = await request(app).get(`/v1/orders/${order.body.id}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: customer.body.id,
          name: customerName,
          email,
        }),
        order_products: expect.arrayContaining([
          expect.objectContaining({
            product_id: product.body.id,
            price: price.toFixed(2),
            quantity: 5,
          }),
        ]),
      }),
    );
  });

  it('should not be able to list an order that not exists', async () => {
    const uuid = faker.random.uuid();
    const response = await request(app).get(`/v1/orders/${uuid}`).expect(404);

    expect(response.body).toStrictEqual({
      code: 244,
      message: 'Order not found',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });
});
