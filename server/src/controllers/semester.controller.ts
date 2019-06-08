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
  BadRequestError,
  UseBefore
} from 'routing-controllers';

import { injector } from '@/server';
import { SemestersService } from '@/db/services/semesters.service';
import {
  SemesterWithModulesCreationInfo,
  SemesterWithModulesEditionInfo,
  checkAllInRange,
  normalizeDates
} from '@/db/models/Semester';
import { ModulesService } from '@/db/services/modules.service';
import { simpleErrorHandler, haveDependenciesErrorHandler } from '@/errors';
import { RestrictMiddleware } from '@/middlewares/restrict.middleware';

@JsonController()
export class SemestersController {
  private semesters: SemestersService = injector.get(SemestersService);
  private modules: ModulesService = injector.get(ModulesService);

  @Get('/semesters')
  public async getAll() {
    return await this.semesters.getAll().catch(simpleErrorHandler);
  }

  @Get('/semester/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.semesters.getSingle(id).catch(simpleErrorHandler);
  }

  @Get('/semester/:id/modules')
  @OnUndefined(NotFoundError)
  public async getModules(@Param('id') id: any) {
    return await this.semesters.getModules(id).catch(simpleErrorHandler);
  }

  @Post('/semester')
  @UseBefore(RestrictMiddleware)
  public async create(@Body() data: SemesterWithModulesCreationInfo) {
    if (!checkAllInRange(data, data.modules)) {
      throw new BadRequestError();
    }

    normalizeDates(data);
    data.modules.forEach((m) => normalizeDates(m));

    const [id] = await this.semesters.create(data);

    const moduleIds = (await Promise.all(
      data.modules.map((m) => {
        m.semester = id;
        return this.modules.create(m);
      })
    ).catch(simpleErrorHandler)).map((res: { id: number }) => res.id);

    return {
      id,
      moduleIds
    };
  }

  @Put('/semester')
  @UseBefore(RestrictMiddleware)
  public async update(@Body() data: SemesterWithModulesEditionInfo) {
    try {
      if (!checkAllInRange(data, data.modules)) {
        return; // TODO: throw smth like DateRangeError
      }

      normalizeDates(data);
      data.modules.forEach((m) => normalizeDates(m));

      await this.semesters.update(data);

      await Promise.all(
        data.modules.map((m) => {
          return this.modules.update(m);
        })
      ).catch(simpleErrorHandler);

      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/semester/:id')
  @UseBefore(RestrictMiddleware)
  public async remove(@Param('id') id: any) {
    await this.semesters.remove(id).catch(haveDependenciesErrorHandler);
    return {};
  }
}
