import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  OnUndefined,
  NotFoundError,
  Delete,
  UseBefore
} from 'routing-controllers';

import { injector } from '@/server';
import { MarksService } from '@/db/services/marks.service';
import { MarkCreationInfo, MarkEditionInfo } from '@/db/models/Mark';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';

@JsonController()
export class MarksController {
  private marks: MarksService = injector.get(MarksService);

  @Get('/marks')
  public async getAll() {
    return await this.marks.getAll().catch(simpleErrorHandler);
  }

  @Get('/mark/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.marks.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/mark')
  @UseBefore(RestrictMiddleware)
  public async create(@Body() data: MarkCreationInfo) {
    const [id] = await this.marks.create(data).catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/mark')
  @UseBefore(RestrictMiddleware)
  public async update(@Body() data: MarkEditionInfo) {
    await this.marks.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/mark/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.marks.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
