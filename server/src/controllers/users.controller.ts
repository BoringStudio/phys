import {
  JsonController,
  Post,
  Body,
  Get,
  Param,
  OnUndefined,
  NotFoundError,
  InternalServerError,
  BadRequestError
} from 'routing-controllers';

import { injector } from '@/server';
import { UsersService } from '@/db/services/users.service';
import { User, UserCreationInfo } from '@/db/models/User';

@JsonController()
export class UsersController {
  private usersService: UsersService = injector.get(
    UsersService
  ) as UsersService;

  @Get('/users')
  public async getAllUsers() {
    const users = await this.usersService.getAllUsers();

    return users.map((user: User) => {
      const { password, ...res } = user;
      return res;
    });
  }

  @Get('/user/:id')
  @OnUndefined(NotFoundError)
  public async getSingleUser(@Param('id') id: any) {
    const user = await this.usersService.getSingleUser(id);

    if (user == null) {
      return;
    }

    const { password, ...res } = user;
    return res;
  }

  @Post('/user')
  @OnUndefined(BadRequestError)
  public async createUser(@Body() data: UserCreationInfo) {
    try {
      const user = await this.usersService.createUser(data);

      const { password, ...res } = user;
      return res;
    } catch (e) {
      return;
    }
  }
}
