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
import { LessonsService } from '@/db/services/lessons.service';
import { LessonCreationInfo, LessonEditionInfo } from '@/db/models/Lesson';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class LessonsController {
  private lessons: LessonsService = injector.get(LessonsService);

  @Get('/lessons')
  public async getAll() {
    return await this.lessons.getAll();
  }

  @Get('/lesson/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.lessons.getSingle(id);
  }

  @Post('/lesson')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: LessonCreationInfo) {
    try {
      const [id] = await this.lessons.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/lesson')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: LessonEditionInfo) {
    try {
      await this.lessons.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/lesson/:id')
  public async remove(@Param('id') id: any) {
    await this.lessons.remove(id);
    return {};
  }
}
