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
import { ClassroomsService } from '@/db/services/classrooms.service';
import { AlreadyExistsError } from '../errors';
import {
  ClassroomCreationInfo,
  ClassroomEditionInfo
} from '@/db/models/Classroom';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class ClassroomsController {
  private classrooms: ClassroomsService = injector.get(ClassroomsService);

  @Get('/classrooms')
  public async getAll() {
    return await this.classrooms.getAll();
  }

  @Get('/classroom/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.classrooms.getSingle(id);
  }

  @Post('/classroom')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: ClassroomCreationInfo) {
    try {
      const [id] = await this.classrooms.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/classroom')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: ClassroomEditionInfo) {
    try {
      await this.classrooms.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/classroom/:id')
  public async remove(@Param('id') id: any) {
    await this.classrooms.remove(id);
    return {};
  }
}
