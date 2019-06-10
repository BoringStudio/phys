import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  Delete,
  UseBefore,
  OnUndefined,
  NotFoundError
} from 'routing-controllers';

import { injector } from '@/server';
import { StudentTestMarksService } from '@/db/services/studentTestMarks.service';
import {
  StudentTestMarkCreationInfo,
  StudentTestMarkEditionInfo
} from '@/db/models/studentTestMark';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';

@JsonController()
export class StudentTestMarksController {
  private studentTestMarks: StudentTestMarksService = injector.get(
    StudentTestMarksService
  );

  @Get('/student_test_marks')
  public async getAll() {
    return await this.studentTestMarks.getAll().catch(simpleErrorHandler);
  }

  @Get('/student_test_mark/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.studentTestMarks.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/student_test_mark')
  public async create(@Body() data: StudentTestMarkCreationInfo) {
    const [id] = await this.studentTestMarks
      .create(data)
      .catch(alreadyExistsErrorHandler);

    return id;
  }

  @Put('/student_test_mark')
  public async update(@Body() data: StudentTestMarkEditionInfo) {
    await this.studentTestMarks.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/student_test_mark/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.studentTestMarks.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
