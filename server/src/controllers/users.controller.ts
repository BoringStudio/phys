import {
  JsonController,
  Post,
  Body,
  OnUndefined,
  InternalServerError,
  Get,
  Param
} from 'routing-controllers';

import { injector } from '@/server';
import { UsersService, IUserCreateInfo } from '@/db/services/users.service';
import { User } from '@/db/models/User';

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
  @OnUndefined(404)
  public async getSingleUser(@Param('id') id: number) {
    const user = await this.usersService.getSingleUser(id);

    if (user == null) {
      return;
    }

    const { password, ...res } = user;
    return res;
  }

  @Post('/user')
  public async createUser(@Body() data: IUserCreateInfo) {
    const user = await this.usersService.createUser(data);

    if (user == null) {
      return;
    }

    const { password, ...res } = user;
    return res;
  }
}
