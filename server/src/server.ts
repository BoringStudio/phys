import 'reflect-metadata';
import Koa from 'koa';
import {
  createKoaServer,
  useContainer,
  InternalServerError
} from 'routing-controllers';
import { ReflectiveInjector } from 'injection-js';
import { Container } from 'typedi';

import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import { UsersService } from './db/services/users.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { LoggingMiddleware } from './middlewares/logging.middleware';

export const injector = ReflectiveInjector.resolveAndCreate([UsersService]);
useContainer(Container);

const app: Koa = createKoaServer({
  routePrefix: '/api',
  defaultErrorHandler: false,
  controllers: [AuthController, UsersController],
  middlewares: [ErrorMiddleware, LoggingMiddleware]
});

app.listen(config.port);

console.log(`Server is running on port ${config.port}`);
