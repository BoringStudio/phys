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
import { ClassroomsService } from '@/db/services/classrooms.service';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import {
  ClassroomCreationInfo,
  ClassroomEditionInfo
} from '@/db/models/Classroom';

@JsonController()
export class ClassroomsController {
  private classrooms: ClassroomsService = injector.get(ClassroomsService);

  @Get('/classrooms')
  public async getAll() {
    return await this.classrooms.getAll().catch(simpleErrorHandler);
  }

  @Get('/classroom/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.classrooms.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/classroom')
  public async create(@Body() data: ClassroomCreationInfo) {
    const [id] = await this.classrooms
      .create(data)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/classroom')
  public async update(@Body() data: ClassroomEditionInfo) {
    await this.classrooms.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/classroom/:id')
  public async remove(@Param('id') id: any) {
    await this.classrooms.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
