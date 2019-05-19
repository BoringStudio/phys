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
  Params,
  UseBefore
} from 'routing-controllers';
import { IsInt } from 'class-validator';

import { injector } from '@/server';
import { DisciplinesService } from '@/db/services/disciplines.service';
import { AlreadyExistsError } from '../errors';
import {
  DisciplineCreationInfo,
  DisciplineEditionInfo,
  DisciplineTestInfo
} from '@/db/models/Discipline';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

class DisciplineTestParameters {
  @IsInt()
  public id: number;

  @IsInt()
  public testId: number;
}

@JsonController()
@UseBefore(AuthMiddleware)
export class DisciplinesController {
  private disciplines: DisciplinesService = injector.get(DisciplinesService);

  @Get('/disciplines')
  public async getAll() {
    return await this.disciplines.getAll();
  }

  @Get('/discipline/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.disciplines.getSingle(id);
  }

  @Post('/discipline')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: DisciplineCreationInfo) {
    try {
      const [id] = await this.disciplines.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/discipline')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: DisciplineEditionInfo) {
    try {
      await this.disciplines.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/discipline/:id')
  public async remove(@Param('id') id: any) {
    await this.disciplines.remove(id);
    return {};
  }

  @Get('/discipline/:id/tests')
  public async getTests(@Param('id') id: any) {
    return await this.disciplines.getTests(id);
  }

  @Post('/discipline/:id/test')
  @OnUndefined(AlreadyExistsError)
  public async addTest(@Param('id') id: any, @Body() data: DisciplineTestInfo) {
    try {
      await this.disciplines.addTest(id, data.testId);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/discipline/:id/test/:testId')
  public async removeTest(@Params() params: DisciplineTestParameters) {
    await this.disciplines.removeTest(params.id, params.testId);
    return {};
  }
}
