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
      ctx.body = new InternalServerError('Server error');
      ctx.status = 500;
    }
  }
}
