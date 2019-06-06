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
import { ClassroomsService } from '@/db/services/classrooms.service';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';
import {
  ClassroomCreationInfo,
  ClassroomEditionInfo
} from '@/db/models/Classroom';
import { SearchParams, PaginationQueryParams } from '@/pagination';

@JsonController()
export class ClassroomsController {
  private classrooms: ClassroomsService = injector.get(ClassroomsService);

  @Get('/classrooms')
  public async getAll(@QueryParams() { page, perPage }: PaginationQueryParams) {
    if (page == null || perPage == null) {
      return await this.classrooms.getAll().catch(simpleErrorHandler);
    }

    return await this.classrooms.getAll().catch(simpleErrorHandler);
  }

  @Get('/classrooms/search')
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

    return await this.classrooms
      .search(decoded, limit)
      .catch(simpleErrorHandler);
  }

  @Get('/classrooms/total')
  public async getTotalCount() {
    const { count } = await this.classrooms
      .getTotalCount()
      .catch(simpleErrorHandler);

    return count;
  }

  @Get('/classroom/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.classrooms.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/classroom')
  public async create(@Body() data: ClassroomCreationInfo) {
    const [id] = await this.classrooms
      .create(data)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/classroom')
  public async update(@Body() data: ClassroomEditionInfo) {
    await this.classrooms.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/classroom/:id')
  public async remove(@Param('id') id: any) {
    await this.classrooms.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
