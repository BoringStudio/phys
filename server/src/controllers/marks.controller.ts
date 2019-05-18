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
import { MarksService } from '@/db/services/marks.service';
import { MarkCreationInfo, MarkEditionInfo } from '@/db/models/Mark';
import { AlreadyExistsError } from '../errors';

@JsonController()
export class MarksController {
  private marks: MarksService = injector.get(MarksService);

  @Get('/marks')
  public async getAll() {
    return await this.marks.getAll();
  }

  @Get('/mark/:id')
  @OnUndefined(NotFoundError)
  public async getSingle(@Param('id') id: any) {
    return await this.marks.getSingle(id);
  }

  @Post('/mark')
  @OnUndefined(AlreadyExistsError)
  public async create(@Body() data: MarkCreationInfo) {
    try {
      const [id] = await this.marks.create(data);
      return id;
    } catch (e) {
      return;
    }
  }

  @Put('/mark')
  @OnUndefined(AlreadyExistsError)
  public async update(@Body() data: MarkEditionInfo) {
    try {
      await this.marks.update(data);
      return {};
    } catch (e) {
      return;
    }
  }

  @Delete('/mark/:id')
  public async remove(@Param('id') id: any) {
    await this.marks.remove(id);
    return {};
  }
}
