import Koa from 'koa';
import {
  Middleware,
  KoaMiddlewareInterface,
  InternalServerError
} from 'routing-controllers';

@Middleware({ type: 'before', priority: 100 })
export class ErrorMiddleware implements KoaMiddlewareInterface {
  public async use(ctx: Koa.Context, next: (err?: any) => Promise<any>) {
    try {
      await next();
    } catch (e) {
      if (typeof e.name === 'string' && typeof e.httpCode === 'number') {
        ctx.response.body = { name: e.name };
        ctx.response.status = e.httpCode;
      } else {
        ctx.response.body = { name: 'InternalServerError' };
        ctx.response.status = 500;
      }
    }
  }
}
