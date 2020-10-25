import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import faker from 'faker';

import createConnection from '../../src/shared/infra/typeorm/index';
import app from '../../src/shared/infra/http/app';
import factory from '../utils/factory';

interface IProduct {
  name: string;
  price: number;
  quantity: number;
}

describe('Product', () => {
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

  it('should be able to get one product', async () => {
    const { name, price, quantity } = await factory.attrs<IProduct>('Product');
    const product = await request(app)
      .post('/v1/products')
      .send({ name, price, quantity });

    const response = await request(app)
      .get(`/v1/products/${product.body.id}`)
      .send();

    expect(response.body).toMatchObject({
      name,
      price: price.toFixed(2),
      quantity,
      url: `${url}/products/${product.body.id}`,
    });
  });

  it('should not be able to get one product', async () => {
    const uuid = faker.random.uuid();

    const response = await request(app)
      .get(`/v1/products/${uuid}`)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      code: 344,
      message: 'Product not found',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to create a new product', async () => {
    const product = await factory.attrs<IProduct>('Product');
    const response = await request(app).post('/v1/products').send(product);

    expect(response.body).toEqual(expect.objectContaining(product));
  });

  it('should not be able to create a product with a name thats is already registered', async () => {
    const { name, price, quantity } = await factory.attrs<IProduct>('Product');
    const product = await request(app).post('/v1/products').send({
      name,
      price,
      quantity,
    });

    expect(product.body).toEqual(
      expect.objectContaining({
        name,
        price,
        quantity,
      }),
    );

    const response = await request(app).post('/v1/products').expect(409).send({
      name,
      price,
      quantity,
    });

    expect(response.body).toStrictEqual({
      code: 349,
      message: 'A product with the same name already exists',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });
});
