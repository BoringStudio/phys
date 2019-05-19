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
import { ModulesService } from '@/db/services/modules.service';
import { ModuleCreationInfo, ModuleEditionInfo } from '@/db/models/Module';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

@JsonController()
@UseBefore(AuthMiddleware)
export class ModulesController {
  private modules: ModulesService = injector.get(ModulesService);

  @Get('/modules')
  public async getAll() {
    return await this.modules.getAll();
  }

  @Get('/module/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.modules.getSingle(id);
  }

  @Post('/module')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: ModuleCreationInfo) {
    try {
      const [id] = await this.modules.create(data);
      return id;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  @Put('/module')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: ModuleEditionInfo) {
    try {
      await this.modules.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/module/:id')
  public async remove(@Param('id') id: any) {
    await this.modules.remove(id);
    return {};
  }
}
