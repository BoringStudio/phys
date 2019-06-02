import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  Delete
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

@JsonController()
export class StudentVisitsController {
  private studentVisits: StudentVisitsService = injector.get(
    StudentVisitsService
  );

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

  @Post('/student_visit')
  public async create(@Body() data: StudentVisitCreationInfo) {
    const [id] = await this.studentVisits
      .create(data)
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
