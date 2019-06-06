import { JsonController, Body, Param, Put, Get } from 'routing-controllers';

import { injector } from '@/server';
import { ParametersService } from '@/db/services/parameters.service';
import { ParameterEditionInfo } from '@/db/models/Parameter';
import { simpleErrorHandler } from '@/errors';

@JsonController()
export class ParametersController {
  private parameters: ParametersService = injector.get(ParametersService);

  @Get('/parameter/:id')
  public async get(@Param('id') id: any) {
    const res = await this.parameters.get(id).catch(simpleErrorHandler);

    if (res == null) {
      return null;
    }

    return res.value;
  }

  @Put('/parameter')
  public async set(@Body() { parameter, value }: ParameterEditionInfo) {
    await this.parameters.set(parameter, value).catch(simpleErrorHandler);
    return {};
  }
}
