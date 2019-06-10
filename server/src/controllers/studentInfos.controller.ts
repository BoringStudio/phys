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
import { StudentInfosService } from '@/db/services/studentInfos.service';
import {
  StudentInfoCreationInfo,
  StudentInfoEditionInfo
} from '@/db/models/StudentInfo';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';

@JsonController()
export class StudentInfosController {
  private studentInfos: StudentInfosService = injector.get(StudentInfosService);

  @Get('/student_infos')
  public async getAll() {
    return await this.studentInfos.getAll().catch(simpleErrorHandler);
  }

  @Get('/student_info/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.studentInfos.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/student_info')
  public async create(@Body() data: StudentInfoCreationInfo) {
    const [id] = await this.studentInfos
      .create(data)
      .catch(alreadyExistsErrorHandler);

    return id;
  }

  @Put('/student_info')
  public async update(@Body() data: StudentInfoEditionInfo) {
    await this.studentInfos.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/student_info/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.studentInfos.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
