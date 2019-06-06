import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  Delete,
  OnUndefined,
  NotFoundError,
  Params
} from 'routing-controllers';

import { injector } from '@/server';
import { StudentVisitsService } from '@/db/services/studentVisits.service';
import {
  StudentVisitCreationInfo,
  StudentVisitEditionInfo
} from '@/db/models/StudentVisit';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import { LessonsService } from '@/db/services/lessons.service';
import { IsInt } from 'class-validator';

class StudentLessonVisitParams {
  @IsInt()
  public lessonId: number;

  @IsInt()
  public studentId: number;
}

@JsonController()
export class StudentVisitsController {
  private studentVisits: StudentVisitsService = injector.get(
    StudentVisitsService
  );
  private lessons: LessonsService = injector.get(LessonsService);

  @Get('/student_visits')
  public async getAll() {
    return await this.studentVisits.getAll().catch(simpleErrorHandler);
  }

  @Get('/student_visits/lesson/:id')
  public async getAllLessonVisits(@Param('id') id: any) {
    return await this.studentVisits
      .getLessonVisits(id)
      .catch(simpleErrorHandler);
  }

  @Get('/student_visits/lesson/:lessonId/student/:studentId')
  public async getStudentLessonVisits(
    @Params() params: StudentLessonVisitParams
  ) {
    const res = await this.lessons.getEntry(params.lessonId, params.studentId);
    if (res == null) {
      return;
    }

    return await this.studentVisits
      .getStudentLessonVisits(params.lessonId, params.studentId)
      .catch(simpleErrorHandler);
  }

  @Post('/student_visit')
  @OnUndefined(NotFoundError)
  public async create(@Body() data: StudentVisitCreationInfo) {
    const res = await this.lessons.getEntry(data.lesson, data.student);
    if (res == null) {
      return;
    }

    const [id] = await this.studentVisits
      .create(data, res.id)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/student_visit')
  public async update(@Body() data: StudentVisitEditionInfo) {
    await this.studentVisits.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/student_visit/:id')
  public async remove(@Param('id') id: any) {
    await this.studentVisits.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
