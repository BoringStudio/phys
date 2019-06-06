import {
  JsonController,
  Post,
  Body,
  Get,
  Param,
  OnUndefined,
  NotFoundError
} from 'routing-controllers';

import { injector } from '@/server';
import { UsersService } from '@/db/services/users.service';
import { User, UserCreationInfo } from '@/db/models/User';
import { simpleErrorHandler, alreadyExistsErrorHandler } from '@/errors';

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
    const user = await this.users.create(data).catch(alreadyExistsErrorHandler);
    const { password, ...res } = user;
    return res;
  }
}
