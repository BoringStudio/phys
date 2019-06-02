import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  OnUndefined,
  NotFoundError,
  Delete
} from 'routing-controllers';

import { injector } from '@/server';
import { MarksService } from '@/db/services/marks.service';
import { MarkCreationInfo, MarkEditionInfo } from '@/db/models/Mark';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
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
  public async create(@Body() data: MarkCreationInfo) {
    const [id] = await this.marks.create(data).catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/mark')
  public async update(@Body() data: MarkEditionInfo) {
    await this.marks.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/mark/:id')
  public async remove(@Param('id') id: any) {
    await this.marks.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
