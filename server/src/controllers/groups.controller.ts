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
  QueryParams,
  UseBefore
} from 'routing-controllers';

import { injector } from '@/server';
import { GroupsService } from '@/db/services/groups.service';
import { GroupCreationInfo, GroupEditionInfo } from '@/db/models/Group';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '../errors';

import { PaginationQueryParams, SearchParams } from '@/pagination';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';

@JsonController()
export class GroupsController {
  private groups: GroupsService = injector.get(GroupsService);

  @Get('/groups')
  public async getAll(@QueryParams() { page, perPage }: PaginationQueryParams) {
    if (page == null || perPage == null) {
      return await this.groups.getAll().catch(simpleErrorHandler);
    }

    return await this.groups.getPage(perPage, page);
  }

  @Get('/groups/search')
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

    return await this.groups.search(decoded, limit).catch(simpleErrorHandler);
  }

  @Get('/groups/total')
  public async getTotalCount() {
    const { count } = await this.groups
      .getTotalCount()
      .catch(simpleErrorHandler);

    return count;
  }

  @Get('/group/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.groups.getSingle(id).catch(simpleErrorHandler);
  }

  @Post('/group')
  @UseBefore(RestrictMiddleware)
  public async create(@Body() data: GroupCreationInfo) {
    const [id] = await this.groups
      .create(data)
      .catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/group')
  @UseBefore(RestrictMiddleware)
  public async update(@Body() data: GroupEditionInfo) {
    await this.groups.update(data).catch(alreadyExistsErrorHandler);
    return {};
  }

  @Delete('/group/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.groups.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
