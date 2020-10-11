import { createConnection, getConnectionOptions, Connection } from 'typeorm';

import { createClient, RedisClient } from 'redis';
import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterAbstract,
  IRateLimiterOptions,
} from 'rate-limiter-flexible';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createClient as mockClient } from 'redis-mock';

import config from '../../config/redis';

const redis = ((): RedisClient => {
  if (process.env.NODE_ENV === 'test') {
    return mockClient();
  }

  return createClient(config);
})();

export function RateLimiter(opts: IRateLimiterOptions): RateLimiterAbstract {
  if (process.env.NODE_ENV === 'test') {
    return new RateLimiterMemory(opts);
  }

  return new RateLimiterRedis({ storeClient: redis, ...opts });
}

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'test'
          ? 'tests'
          : process.env.POSTGRES_DATABASE,
    }),
  );
};
