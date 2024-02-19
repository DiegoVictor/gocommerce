import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';

import AppError from '@shared/errors/AppError';
import createConnection from '@shared/infra/typeorm';
import routeAliases from '@shared/infra/http/middlewares/routeAliases';
import routes from '@shared/infra/http/routes';

import '@shared/container';

createConnection();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(routeAliases);

app.use('/v1', routes);

app.use(errors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...err.data,
      docs: process.env.DOCS_URL,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
