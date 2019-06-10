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
  Params,
  Ctx
} from 'routing-controllers';
import moment from 'moment-timezone';

import { injector } from '@/server';
import { StudentVisitsService } from '@/db/services/studentVisits.service';
import {
  StudentVisitCreationInfo,
  StudentVisitEditionInfo
} from '@/db/models/StudentVisit';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler,
  NotInRangeError,
  InactiveModuleError
} from '../errors';
import { LessonsService } from '@/db/services/lessons.service';
import { SemestersService } from '@/db/services/semesters.service';
import { IsNumberString } from 'class-validator';
import { Semester } from '@/db/models/Semester';
import { Module } from '@/db/models/Module';
import { Lesson } from '@/db/models/Lesson';
import { Context } from 'koa';
import { User } from '@/db/models/User';

class StudentLessonVisitParams {
  @IsNumberString()
  public lessonId: number;

  @IsNumberString()
  public studentId: number;
}

@JsonController()
export class StudentVisitsController {
  private studentVisits: StudentVisitsService = injector.get(
    StudentVisitsService
  );
  private lessons: LessonsService = injector.get(LessonsService);
  private semester: SemestersService = injector.get(SemestersService);

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
  public async create(
    @Body() data: StudentVisitCreationInfo,
    @Ctx() ctx: Context
  ) {
    const user = ctx.state.user as User;

    const res = await this.lessons.getEntry(data.lesson, data.student);
    if (res == null) {
      return;
    }

    if (user.fullAccess !== true) {
      try {
        await this.checkVisitInActiveModule(data.week, data.lesson);
      } catch (e) {
        throw e;
      }
    }

    const [id] = await this.studentVisits
      .create(data, res.id)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/student_visit')
  @OnUndefined(NotFoundError)
  public async update(
    @Body() data: StudentVisitEditionInfo,
    @Ctx() ctx: Context
  ) {
    const user = ctx.state.user as User;

    if (user.fullAccess !== true) {
      const [visit, entry] = await Promise.all([
        this.studentVisits.getSingle(data.id),
        this.studentVisits.getEntry(data.id)
      ]);
      if (visit == null) {
        return;
      }

      try {
        await this.checkVisitInActiveModule(visit.week, entry.lesson);
      } catch (e) {
        throw e;
      }
    }

    await this.studentVisits.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/student_visit/:id')
  @OnUndefined(NotFoundError)
  public async remove(@Param('id') id: any, @Ctx() ctx: Context) {
    const user = ctx.state.user as User;

    if (user.fullAccess !== true) {
      const [visit, entry] = await Promise.all([
        this.studentVisits.getSingle(id),
        this.studentVisits.getEntry(id)
      ]);
      if (visit == null) {
        return;
      }

      try {
        await this.checkVisitInActiveModule(visit.week, entry.lesson);
      } catch (e) {
        throw e;
      }
    }

    await this.studentVisits.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }

  private async checkVisitInActiveModule(visitWeek: number, lessonId: number) {
    const [lesson, semester]: [Lesson, Semester] = await Promise.all([
      this.lessons.getSingle(lessonId),
      this.lessons.getSemester(lessonId)
    ]);
    const modules: Module[] = await this.semester.getModules(semester.id);

    const weekBegin = moment(semester.begin).startOf('week');
    const end = moment(semester.end);

    let week = 0;
    const current = weekBegin.add(lesson.day, 'days');
    while (current < end && week < visitWeek) {
      ++week;
      current.add(1, 'week');
    }

    if (week !== visitWeek) {
      throw new NotInRangeError();
    }

    let mod: Module | null = null;
    for (let i = 0; i < modules.length; ++i) {
      if (
        modules[i].begin <= current.toDate() &&
        modules[i].end >= current.toDate()
      ) {
        mod = modules[i];
        break;
      }
    }

    if (mod != null && !mod.isActive) {
      throw new InactiveModuleError();
    }
  }
}
