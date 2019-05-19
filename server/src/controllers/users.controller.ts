import {
  JsonController,
  Post,
  Body,
  Get,
  Param,
  OnUndefined,
  NotFoundError,
  BadRequestError,
  UseBefore
} from 'routing-controllers';

import { injector } from '@/server';
import { UsersService } from '@/db/services/users.service';
import { User, UserCreationInfo } from '@/db/models/User';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class UsersController {
  private users: UsersService = injector.get(UsersService);

  @Get('/users')
  public async getAll() {
    const users = await this.users.getAll();

    return users.map((user: User) => {
      const { password, ...res } = user;
      return res;
    });
  }

  @Get('/user/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    const user = await this.users.getSingle(id);

    if (user == null) {
      return;
    }

    const { password, ...res } = user;
    return res;
  }

  @Post('/user')
  @OnUndefined(BadRequestError)
  public async create(@Body() data: UserCreationInfo) {
    try {
      const user = await this.users.create(data);
      const { password, ...res } = user;
      return res;
    } catch (e) {
      return;
    }
  }
}
