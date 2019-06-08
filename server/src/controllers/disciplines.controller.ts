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
  QueryParams,
  UseBefore
} from 'routing-controllers';
import { IsInt } from 'class-validator';

import { injector } from '@/server';
import { DisciplinesService } from '@/db/services/disciplines.service';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import {
  DisciplineCreationInfo,
  DisciplineEditionInfo,
  DisciplineTestInfo,
  DisciplineTestsInfo
} from '@/db/models/Discipline';
import { SearchParams } from '@/pagination';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';

class DisciplineTestParameters {
  @IsInt()
  public id: number;

  @IsInt()
  public testId: number;
}

@JsonController()
export class DisciplinesController {
  private disciplines: DisciplinesService = injector.get(DisciplinesService);

  @Get('/disciplines')
  public async getAll() {
    return await this.disciplines.getAll().catch(simpleErrorHandler);
  }

  @Get('/disciplines/search')
  public async search(@QueryParams() { match, limit }: SearchParams) {
    if (match == null || limit == null) {
      return [];
    }

    let decoded = '';

    try {
      decoded = decodeURIComponent(match);
    } catch (e) {
      return [];
    }

    return await this.disciplines
      .search(decoded, limit)
      .catch(simpleErrorHandler);
  }

  @Get('/discipline/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.disciplines.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/discipline')
  @UseBefore(RestrictMiddleware)
  public async create(@Body() data: DisciplineCreationInfo) {
    const [id] = await this.disciplines
      .create(data)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/discipline')
  @UseBefore(RestrictMiddleware)
  public async update(@Body() data: DisciplineEditionInfo) {
    await this.disciplines.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/discipline/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.disciplines.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }

  @Get('/discipline/:id/tests')
  @UseBefore(RestrictMiddleware)
  public async getTests(@Param('id') id: any) {
    const tests = await this.disciplines.getTests(id).catch(simpleErrorHandler);
    return tests.map((v: { test: number }) => v.test);
  }

  @Post('/discipline/:id/test')
  @UseBefore(RestrictMiddleware)
  public async addTest(@Param('id') id: any, @Body() data: DisciplineTestInfo) {
    await this.disciplines
      .addTest(id, data.testId)
      .catch(alreadyExistsErrorHandler);
    return {};
  }

  @Put('/discipline/:id/tests')
  @UseBefore(RestrictMiddleware)
  public async editTests(
    @Param('id') id: any,
    @Body() data: DisciplineTestsInfo
  ) {
    await this.disciplines
      .updateTests(id, data.testIds)
      .catch(simpleErrorHandler);
    return {};
  }

  @Delete('/discipline/:id/test/:testId')
  @UseBefore(RestrictMiddleware)
  public async removeTest(@Params() params: DisciplineTestParameters) {
    await this.disciplines
      .removeTest(params.id, params.testId)
      .catch(haveDependenciesErrorHandler);
    return {};
  }
}
