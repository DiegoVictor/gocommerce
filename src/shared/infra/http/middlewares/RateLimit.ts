import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

import { RateLimiter } from '../../typeorm';
import config from '../../../config/security';

const limiter = RateLimiter({
  duration: config.duration,
  points: config.points,
});

export default async (
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await limiter.consume(request.ip);
    next();
  } catch (err) {
    throw new AppError('Too Many Requests', { code: 429 }, 429);
  }
};
