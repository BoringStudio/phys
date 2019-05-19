import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  OnUndefined,
  NotFoundError,
  Delete,
  UseBefore
} from 'routing-controllers';

import { injector } from '@/server';
import { TestsService } from '@/db/services/tests.service';
import { TestCreationInfo, TestEditionInfo } from '@/db/models/Test';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class TestsController {
  private tests: TestsService = injector.get(TestsService);

  @Get('/tests')
  public async getAll() {
    return await this.tests.getAll();
  }

  @Get('/test/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.tests.getSingle(id);
  }

  @Post('/test')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: TestCreationInfo) {
    try {
      const [id] = await this.tests.create(data);
      return id;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  @Put('/test')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: TestEditionInfo) {
    try {
      await this.tests.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/test/:id')
  public async remove(@Param('id') id: any) {
    await this.tests.remove(id);
    return {};
  }
}
