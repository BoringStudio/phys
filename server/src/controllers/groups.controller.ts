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
  private groups: GroupsService = injector.get(GroupsService);

  @Get('/groups')
  public async getAll() {
    return await this.groups.getAll();
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
    await this.groups.remove(id);
    return {};
  }
}
