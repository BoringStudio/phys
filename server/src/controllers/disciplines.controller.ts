import {
  JsonController,
  Body,
  Param,
  Post,
  Put,
  Get,
  OnUndefined,
  NotFoundError,
  Delete
} from 'routing-controllers';

import { injector } from '@/server';
import { DisciplinesService } from '@/db/services/disciplines.service';
import { AlreadyExistsError } from '../errors';
import {
  DisciplineCreationInfo,
  DisciplineEditionInfo
} from '@/db/models/Discipline';

@JsonController()
export class DisciplinesController {
  private disciplines: DisciplinesService = injector.get(DisciplinesService);

  @Get('/disciplines')
  public async getAll() {
    return await this.disciplines.getAll();
  }

  @Get('/discipline/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.disciplines.getSingle(id);
  }

  @Post('/discipline')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: DisciplineCreationInfo) {
    try {
      const [id] = await this.disciplines.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/discipline')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: DisciplineEditionInfo) {
    try {
      await this.disciplines.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/discipline/:id')
  public async remove(@Param('id') id: any) {
    await this.disciplines.remove(id);
    return {};
  }
}
