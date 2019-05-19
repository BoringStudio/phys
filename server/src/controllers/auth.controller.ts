import {
  JsonController,
  Post,
  Body,
  OnUndefined,
  UnauthorizedError
} from 'routing-controllers';
import jwt from 'jsonwebtoken';

import { Length } from 'class-validator';
import { injector } from '@/server';

import { UsersService } from '@/db/services/users.service';

class AuthRequest {
  @Length(4, 50)
  public login: string;

  @Length(4, 50)
  public password: string;
}

@JsonController()
export class AuthController {
  private users: UsersService = injector.get(UsersService);

  @Post('/auth')
  @OnUndefined(UnauthorizedError)
  public async auth(@Body() data: AuthRequest) {
    const user = await this.users.findByAuthData(data.login, data.password);

    if (user == null) {
      return;
    }

    const { password, ...payload } = user;

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 12 * 60 * 60 // 12h
    });

    return {
      token
    };
  }
}
