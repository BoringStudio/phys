import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  OnUndefined,
  NotFoundError,
  Delete
} from 'routing-controllers';

import { injector } from '@/server';
import { GroupsService } from '@/db/services/groups.service';
import { GroupCreationInfo, GroupEditionInfo } from '@/db/models/Group';
import { AlreadyExistsError } from './errors';

@JsonController()
export class GroupsController {
  private groupsService: GroupsService = injector.get(
    GroupsService
  ) as GroupsService;

  @Get('/groups')
  public async getAllGroups() {
    return await this.groupsService.getAllGroups();
  }

  @Get('/group/:id')
  @OnUndefined(NotFoundError)
  public async getSingleGroup(@Param('id') id: any) {
    if (typeof id !== 'number') {
      return;
    }

    return await this.groupsService.getSingleGroup(id);
  }

  @Post('/group')
  @OnUndefined(AlreadyExistsError)
  public async createGroup(@Body() data: GroupCreationInfo) {
    try {
      const [id] = await this.groupsService.createGroup(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/group')
  @OnUndefined(AlreadyExistsError)
  public async updateGroup(@Body() data: GroupEditionInfo) {
    try {
      await this.groupsService.updateGroup(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/group/:id')
  public async removeGroup(@Param('id') id: any) {
    await this.groupsService.removeGroup(id);
    return {};
  }
}
