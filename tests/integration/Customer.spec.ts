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

describe('Customer', () => {
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

  it('should be able to get one customer', async () => {
    const { name, email } = await factory.attrs<ICustomer>('Customer');
    const customer = await request(app)
      .post('/v1/customers')
      .send({ name, email });

    const response = await request(app)
      .get(`/v1/customers/${customer.body.id}`)
      .send();

    expect(response.body).toMatchObject({
      name,
      email,
      url: `${url}/customers/${customer.body.id}`,
    });
  });

  it('should not be able to get one customer', async () => {
    const uuid = faker.datatype.uuid();

    const response = await request(app)
      .get(`/v1/customers/${uuid}`)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      code: 144,
      message: 'Customer not found',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to create a new customer', async () => {
    const customer = await factory.attrs<ICustomer>('Customer');
    const response = await request(app).post('/v1/customers').send(customer);

    expect(response.body).toEqual(expect.objectContaining(customer));
  });

  it('should not be able to create a customer with one e-mail thats already registered', async () => {
    const { name, email } = await factory.attrs<ICustomer>('Customer');
    const customer = await request(app).post('/v1/customers').send({
      name,
      email,
    });

    expect(customer.body).toEqual(
      expect.objectContaining({
        name,
        email,
      }),
    );

    const response = await request(app).post('/v1/customers').expect(400).send({
      name,
      email,
    });

    expect(response.body).toStrictEqual({
      code: 140,
      message: 'The email provided already in use',
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });
});
