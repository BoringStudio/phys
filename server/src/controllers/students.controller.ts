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
  QueryParams
} from 'routing-controllers';

import { injector } from '@/server';
import { StudentsService } from '@/db/services/students.service';
import { StudentCreationInfo, StudentEditionInfo } from '@/db/models/Student';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';

import { PaginationQueryParams, SearchParams } from '@/pagination';

@JsonController()
export class StudentsController {
  private students: StudentsService = injector.get(StudentsService);

  @Get('/students')
  public async getAll(@QueryParams() { page, perPage }: PaginationQueryParams) {
    if (page == null || perPage == null) {
      return await this.students.getAll().catch(simpleErrorHandler);
    }

    return await this.students.getPage(perPage, page).catch(simpleErrorHandler);
  }

  @Get('/students/search')
  public async search(@QueryParams() { match, limit }: SearchParams) {
    if (match == null || limit == null || match.length === 0) {
      return [];
    }

    let decoded = '';

    try {
      decoded = decodeURIComponent(match);
    } catch (e) {
      return [];
    }

    return await this.students.search(decoded, limit).catch(simpleErrorHandler);
  }

  @Get('/students/total')
  public async getTotalCount() {
    const { count } = await this.students
      .getTotalCount()
      .catch(simpleErrorHandler);
    return count;
  }

  @Get('/student/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.students.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/student')
  public async create(@Body() data: StudentCreationInfo) {
    const [id] = await this.students
      .create(data)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/student')
  public async update(@Body() data: StudentEditionInfo) {
    await this.students.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/student/:id')
  public async remove(@Param('id') id: any) {
    await this.students.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
