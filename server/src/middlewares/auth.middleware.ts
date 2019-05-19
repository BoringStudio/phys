import Koa from 'koa';
import { KoaMiddlewareInterface, UnauthorizedError } from 'routing-controllers';

import jwt from 'jsonwebtoken';

export class AuthMiddleware implements KoaMiddlewareInterface {
  public async use(ctx: Koa.Context, next: (err?: any) => Promise<any>) {
    try {
      const regex = /^(?:Bearer )?(.*)$/;
      const matchingResult = regex.exec(ctx.req.headers.authorization);
      if (matchingResult == null) {
        throw Error();
      }

      const [, token] = matchingResult;

      ctx.state.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      ctx.response.status = 401;
      ctx.response.body = { name: 'Unauthorized' };
      return;
    }

    return next();
  }
}
