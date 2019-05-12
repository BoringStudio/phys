import knex from 'knex';
import { Connection } from '../connection';
import {
  DisciplineCreationInfo,
  DisciplineEditionInfo
} from '../models/Discipline';

const disciplinesTable = 'disciplines';

export class DisciplinesService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(disciplinesTable).select('*');
  }

  public getSingle(id: number) {
    return this.db(disciplinesTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public create(data: DisciplineCreationInfo) {
    return this.db(disciplinesTable)
      .insert({
        name: data.name
      })
      .returning('id');
  }

  public update(data: DisciplineEditionInfo) {
    return this.db(disciplinesTable)
      .update({
        name: data.name
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(disciplinesTable)
      .where('id', id)
      .delete();
  }
}
