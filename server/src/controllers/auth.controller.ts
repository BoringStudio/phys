import {
  JsonController,
  Post,
  Body,
  UnauthorizedError
} from 'routing-controllers';
import jwt from 'jsonwebtoken';

import { Length } from 'class-validator';
import { injector } from '@/server';

import { UsersService } from '@/db/services/users.service';
import { simpleErrorHandler } from '@/errors';

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
  public async auth(@Body() data: AuthRequest) {
    const user = await this.users
      .findByAuthData(data.login, data.password)
      .catch(simpleErrorHandler);

    if (user == null) {
      throw new UnauthorizedError();
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
