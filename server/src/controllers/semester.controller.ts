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
import { SemestersService } from '@/db/services/semesters.service';
import {
  SemesterCreationInfo,
  SemesterEditionInfo
} from '@/db/models/Semester';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class SemestersController {
  private semesters: SemestersService = injector.get(SemestersService);

  @Get('/semesters')
  public async getAll() {
    return await this.semesters.getAll();
  }

  @Get('/semester/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.semesters.getSingle(id);
  }

  @Post('/semester')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: SemesterCreationInfo) {
    try {
      const [id] = await this.semesters.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/semester')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: SemesterEditionInfo) {
    try {
      await this.semesters.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/semester/:id')
  public async remove(@Param('id') id: any) {
    await this.semesters.remove(id);
    return {};
  }
}
