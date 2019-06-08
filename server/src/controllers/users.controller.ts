import {
  JsonController,
  Post,
  Body,
  Get,
  Param,
  OnUndefined,
  NotFoundError,
  Put,
  Delete
} from 'routing-controllers';

import { injector } from '@/server';
import { UsersService } from '@/db/services/users.service';
import { User, UserCreationInfo, UserEditionInfo } from '@/db/models/User';
import {
  simpleErrorHandler,
  alreadyExistsErrorHandler,
  haveDependenciesErrorHandler
} from '@/errors';

@JsonController()
export class UsersController {
  private users: UsersService = injector.get(UsersService);

  @Get('/users')
  public async getAll() {
    const users = await this.users.getAll().catch(simpleErrorHandler);

    return users.map((user: User) => {
      const { password, ...res } = user;
      return res;
    });
  }

  @Get('/user/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    const user = await this.users.getSingle(id).catch(simpleErrorHandler);

    if (user == null) {
      return;
    }

    const { password, ...res } = user;
    return res;
  }

  @Post('/user')
  public async create(@Body() data: UserCreationInfo) {
    const [id] = await this.users.create(data).catch(alreadyExistsErrorHandler);
    return id;
  }

  @Put('/user')
  public async update(@Body() data: UserEditionInfo) {
    await this.users.update(data).catch(simpleErrorHandler);
    return {};
  }

  @Delete('/user/:id')
  public async remove(@Param('id') id: any) {
    await this.users.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
