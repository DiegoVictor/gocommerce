import request from 'supertest';
import { getConnection } from 'typeorm';

import app from '../../src/shared/infra/http/app';
import createConnection from '../../src/shared/infra/typeorm/index';

describe('RateLimit', () => {
  afterAll(async () => {
    const connection = await createConnection('test-connection');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should not be able to consume after many requests', async () => {
    const requests: request.Test[] = [];

    Array.from(Array(20).keys()).forEach(() => {
      requests.push(request(app).get('/v1/'));
    });

    const responses = await Promise.all(requests);

    expect(responses.pop()?.body).toStrictEqual({
      message: 'Too Many Requests',
      code: 429,
      status: 'error',
      docs: process.env.DOCS_URL,
    });
  });
});
