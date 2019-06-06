import Koa from 'koa';
import { Middleware, KoaMiddlewareInterface } from 'routing-controllers';

import { config } from '@/config';

interface ILogData {
  method: string;
  url: string;
  query: string;
  remoteAddress: string;
  host: string;
  userAgent: string;
  statusCode: number;
  errorMessage: string;
  errorStack: string;
  data: any;
  responseTime: number;
}

@Middleware({ type: 'before' })
export class LoggingMiddleware implements KoaMiddlewareInterface {
  public async use(ctx: Koa.Context, next: (err?: any) => Promise<any>) {
    const start = Date.now();

    const logData: Partial<ILogData> = {
      method: ctx.method,
      url: ctx.url,
      query: ctx.query,
      remoteAddress: ctx.request.ip,
      host: ctx.headers.host,
      userAgent: ctx.headers['user-agent']
    };

    let errorThrown: any = null;
    try {
      await next();
      logData.statusCode = ctx.status;
    } catch (e) {
      errorThrown = e;
      logData.errorMessage = e.message;
      logData.errorStack = e.stack;
      logData.statusCode = e.httpCode || 500;
      if (e.data) {
        logData.data = e.data;
      }
    }

    logData.responseTime = Date.now() - start;
    this.outputLog(logData, errorThrown);

    if (errorThrown) {
      throw errorThrown;
    }
  }

  private outputLog(data: Partial<ILogData>, thrownError: any) {
    if (config.prettyLog) {
      console.log(
        `${data.statusCode} ${data.method} ${data.url} - ${data.responseTime}ms`
      );
      if (thrownError) {
        console.log(thrownError);
      }
    } else if (data.statusCode < 400) {
      process.stdout.write(JSON.stringify(data) + '\n');
    } else {
      process.stderr.write(JSON.stringify(data) + '\n');
    }
  }
}
