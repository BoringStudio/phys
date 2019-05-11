import {
  JsonController,
  Post,
  Body,
  OnUndefined,
  InternalServerError
} from 'routing-controllers';

import { injector } from '@/server';
import { UsersService } from '@/db/services/users.service';

interface IAuthRequest {
  login: string;
  password: string;
}

@JsonController()
export class AuthController {
  private usersService: UsersService = injector.get(
    UsersService
  ) as UsersService;

  @Post('/auth')
  @OnUndefined(401)
  public async auth(@Body() data: IAuthRequest) {
    const user = await this.usersService.findByAuthData(
      data.login,
      data.password
    );

    if (user == null) {
      return;
    }

    const { password, ...res } = user;
    return res;
  }
}
