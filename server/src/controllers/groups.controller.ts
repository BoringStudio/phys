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
  UseBefore,
  QueryParams
} from 'routing-controllers';

import { injector } from '@/server';
import { GroupsService } from '@/db/services/groups.service';
import { GroupCreationInfo, GroupEditionInfo, Group } from '@/db/models/Group';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

import { PaginationQueryParams } from '@/pagination';

@JsonController()
@UseBefore(AuthMiddleware)
export class GroupsController {
  private groups: GroupsService = injector.get(GroupsService);

  @Get('/groups')
  public async getAll(@QueryParams() { page, perPage }: PaginationQueryParams) {
    if (page == null || perPage == null) {
      return await this.groups.getAll();
    }

    return await this.groups.getPage(perPage, page);
  }

  @Get('/groups/total')
  public async getTotalCount() {
    return (await this.groups.getTotalCount()).count;
  }

  @Get('/group/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.groups.getSingle(id);
  }

  @Post('/group')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: GroupCreationInfo) {
    try {
      const [id] = await this.groups.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/group')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: GroupEditionInfo) {
    try {
      await this.groups.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/group/:id')
  public async remove(@Param('id') id: any) {
    const res = await this.groups.remove(id);
    return {};
  }
}
