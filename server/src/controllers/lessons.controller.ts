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
  Ctx
} from 'routing-controllers';

import { injector } from '@/server';
import { LessonsService } from '@/db/services/lessons.service';
import { LessonCreationInfo, LessonEditionInfo } from '@/db/models/Lesson';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import { ParametersService } from '@/db/services/parameters.service';
import { ParameterType } from '@/db/models/Parameter';
import { Context } from 'koa';
import { User } from '@/db/models/User';

@JsonController()
export class LessonsController {
  private lessons: LessonsService = injector.get(LessonsService);
  private parameters: ParametersService = injector.get(ParametersService);

  @Get('/lessons')
  public async getAll() {
    return await this.lessons.getAll().catch(simpleErrorHandler);
  }

  @Get('/lessons/current_semester')
  public async getCurrentSemesterLessons() {
    const res = await this.parameters
      .get(ParameterType.CURRENT_SEMESTER)
      .catch(simpleErrorHandler);

    if (res == null) {
      return [];
    }

    const semesterId = parseInt(res.value, 10);

    return await this.lessons
      .getSemesterLessons(semesterId)
      .catch(simpleErrorHandler);
  }

  @Get('/lesson/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.lessons.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/lesson')
  public async create(@Body() data: LessonCreationInfo, @Ctx() ctx: Context) {
    const user = ctx.state.user as User;

    if (!user.fullAccess || data.semester === -1 || data.semester == null) {
      const res = await this.parameters
        .get(ParameterType.CURRENT_SEMESTER)
        .catch(simpleErrorHandler);

      if (res != null) {
        data.semester = parseInt(res.value, 10);
      }
    }

    if (!user.fullAccess || data.teacher === -1 || data.teacher == null) {
      data.teacher = user.id;
    }

    const [id] = await this.lessons
      .create(data)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/lesson')
  public async update(@Body() data: LessonEditionInfo) {
    await this.lessons.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/lesson/:id')
  public async remove(@Param('id') id: any) {
    await this.lessons.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
