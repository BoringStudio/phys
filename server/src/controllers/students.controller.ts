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
import { StudentsService } from '@/db/services/students.service';
import { StudentCreationInfo, StudentEditionInfo } from '@/db/models/Student';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class StudentsController {
  private students: StudentsService = injector.get(StudentsService);

  @Get('/students')
  public async getAll() {
    return await this.students.getAll();
  }

  @Get('/student/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.students.getSingle(id);
  }

  @Post('/student')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: StudentCreationInfo) {
    try {
      const [id] = await this.students.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/student')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: StudentEditionInfo) {
    try {
      await this.students.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/student/:id')
  public async remove(@Param('id') id: any) {
    await this.students.remove(id);
    return {};
  }
}
