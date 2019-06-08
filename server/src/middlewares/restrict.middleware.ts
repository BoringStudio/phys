import Koa from 'koa';
import { KoaMiddlewareInterface } from 'routing-controllers';
import { NotAllowedError } from '@/errors';

export class RestrictMiddleware implements KoaMiddlewareInterface {
  public async use(ctx: Koa.Context, next: (err?: any) => Promise<any>) {
    if (!ctx.state.user.fullAccess) {
      return Promise.reject(new NotAllowedError());
    }

    return next();
  }
}
