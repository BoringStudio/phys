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
  Ctx,
  Params,
  UseBefore
} from 'routing-controllers';

import { injector } from '@/server';
import { LessonsService } from '@/db/services/lessons.service';
import {
  LessonCreationInfo,
  LessonEditionInfo,
  StudentEntryInfo,
  Lesson
} from '@/db/models/Lesson';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler,
  NotAllowedError
} from '../errors';
import { ParametersService } from '@/db/services/parameters.service';
import { ParameterType } from '@/db/models/Parameter';
import { Context } from 'koa';
import { User } from '@/db/models/User';
import { IsNumberString } from 'class-validator';
import { ClassroomsService } from '@/db/services/classrooms.service';
import { DisciplinesService } from '@/db/services/disciplines.service';
import { SemestersService } from '@/db/services/semesters.service';
import { StudentInfosService } from '@/db/services/studentInfos.service';
import { StudentVisitsService } from '@/db/services/studentVisits.service';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';
import { StudentTestMarksService } from '@/db/services/studentTestMarks.service';

class StudentEntryParameters {
  @IsNumberString()
  public id: number;

  @IsNumberString()
  public studentId: number;
}

@JsonController()
export class LessonsController {
  private lessons: LessonsService = injector.get(LessonsService);
  private semesters: SemestersService = injector.get(SemestersService);
  private classrooms: ClassroomsService = injector.get(ClassroomsService);
  private parameters: ParametersService = injector.get(ParametersService);
  private disciplines: DisciplinesService = injector.get(DisciplinesService);
  private studentInfos: StudentInfosService = injector.get(StudentInfosService);
  private studentVisits: StudentVisitsService = injector.get(
    StudentVisitsService
  );
  private studentTestMarks: StudentTestMarksService = injector.get(
    StudentTestMarksService
  );

  @Get('/lessons')
  public async getAll() {
    return await this.lessons.getAll().catch(simpleErrorHandler);
  }

  @Get('/lessons/current_semester/user/:id')
  @OnUndefined(NotAllowedError)
  public async getTeacherCurrentSemesterLesson(
    @Ctx() ctx: Context,
    @Param('id') id: any
  ) {
    const user = ctx.state.user as User;

    if (user.fullAccess !== true && user.id !== id) {
      return;
    }

    const res = await this.parameters
      .get(ParameterType.CURRENT_SEMESTER)
      .catch(simpleErrorHandler);

    if (res == null) {
      return [];
    }

    const semesterId = parseInt(res.value, 10);

    return await this.lessons
      .getTeacherSemesterLessons(id, semesterId)
      .catch(simpleErrorHandler);
  }

  @Get('/lessons/current_semester')
  @UseBefore(RestrictMiddleware)
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

  @Get('/lesson/:id/full_info')
  @OnUndefined(NotFoundError)
  public async getFullInfo(@Param('id') id: any) {
    const lesson: Lesson = await this.lessons.getSingle(id);
    if (lesson == null) {
      return;
    }

    const [
      classroom,
      discipline,
      semester,
      students,
      groups,
      tests
    ] = await Promise.all([
      this.classrooms.getSingle(lesson.classroom),
      this.disciplines.getSingle(lesson.discipline),
      this.semesters.getSingle(lesson.semester),
      this.lessons.getStudents(id),
      this.lessons.getGroups(id),
      this.lessons.getTests(lesson.id)
    ]);

    const modules = await this.semesters.getModules(semester.id);

    return {
      lesson,
      classroom,
      discipline,
      semester,
      modules,
      students,
      groups,
      tests
    };
  }

  @Get('/lesson/:id/students')
  @OnUndefined(NotFoundError)
  public async getStudents(@Param('id') id: any) {
    return await this.lessons.getStudents(id).catch(simpleErrorHandler);
  }

  @Get('/lesson/:id/student_infos')
  @OnUndefined(NotFoundError)
  public async getStudentInfos(@Param('id') id: any) {
    return await this.studentInfos.getLessonInfos(id).catch(simpleErrorHandler);
  }

  @Get('/lesson/:id/student_test_marks')
  @OnUndefined(NotFoundError)
  public async getLessonTestMarks(@Param('id') id: any) {
    return await this.studentTestMarks
      .getLessonTestMarks(id)
      .catch(simpleErrorHandler);
  }

  @Get('/lesson/:id/student_visits')
  public async getStudentVisits(@Param('id') id: any) {
    return await this.studentVisits
      .getLessonVisits(id)
      .catch(simpleErrorHandler);
  }

  @Get('/lesson/:id/student_test_marks')
  public async getStudentTestMarks(@Param('id') id: any) {
    return await this.studentTestMarks
      .getLessonTestMarks(id)
      .catch(simpleErrorHandler);
  }

  @Get('/lesson/:id/groups')
  @OnUndefined(NotFoundError)
  public async getGroups(@Param('id') id: any) {
    return await this.lessons.getGroups(id).catch(simpleErrorHandler);
  }

  @Get('/lesson/:id/tests')
  @OnUndefined(NotFoundError)
  public async getTests(@Param('id') id: any) {
    return await this.lessons.getTests(id).catch(simpleErrorHandler);
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
  @UseBefore(RestrictMiddleware)
  public async update(@Body() data: LessonEditionInfo) {
    await this.lessons.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/lesson/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.lessons.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }

  @Post('/lesson/:id/student')
  public async addStudent(
    @Param('id') id: any,
    @Body() data: StudentEntryInfo
  ) {
    await this.lessons
      .addStudent(id, data.studentId)
      .catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/lesson/:id/student/:studentId')
  public async removeStudent(@Params()
  {
    id,
    studentId
  }: StudentEntryParameters) {
    await this.lessons
      .removeStudent(id, studentId)
      .catch(haveDependenciesErrorHandler);
    return {};
  }
}
