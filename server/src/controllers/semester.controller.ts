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
import { SemestersService } from '@/db/services/semesters.service';
import {
  SemesterWithModulesCreationInfo,
  SemesterWithModulesEditionInfo,
  checkAllInRange
} from '@/db/models/Semester';
import { AlreadyExistsError } from '../errors';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ModulesService } from '@/db/services/modules.service';
import {
  Module,
  ModuleCreationInfo,
  ModuleEditionInfo
} from '@/db/models/Module';

@JsonController()
@UseBefore(AuthMiddleware)
export class SemestersController {
  private semesters: SemestersService = injector.get(SemestersService);
  private modules: ModulesService = injector.get(ModulesService);

  @Get('/semesters')
  public async getAll() {
    return await this.semesters.getAll();
  }

  @Get('/semester/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.semesters.getSingle(id);
  }

  @Get('/semester/:id/modules')
  @OnUndefined(NotFoundError)
  public async getModules(@Param('id') id: any) {
    return await this.semesters.getModules(id);
  }

  @Post('/semester')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: SemesterWithModulesCreationInfo) {
    try {
      if (!checkAllInRange(data, data.modules)) {
        return; // TODO: throw smth like DateRangeError
      }

      const [id] = await this.semesters.create(data);

      const moduleIds = (await Promise.all(
        data.modules.map((m) => {
          m.semester = id;
          return this.modules.create(m);
        })
      )).map((res: { id: number }) => res.id);

      return {
        id,
        moduleIds
      };
    } catch (e) {
      return;
    }
  }

  @Put('/semester')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: SemesterWithModulesEditionInfo) {
    try {
      if (!checkAllInRange(data, data.modules)) {
        return; // TODO: throw smth like DateRangeError
      }

      await this.semesters.update(data);

      await Promise.all(
        data.modules.map((m) => {
          return this.modules.update(m);
        })
      );

      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/semester/:id')
  public async remove(@Param('id') id: any) {
    await this.semesters.remove(id);
    return {};
  }
}
