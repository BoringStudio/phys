import knex from 'knex';
import { Connection } from '../connection';
import { ModuleCreationInfo, ModuleEditionInfo } from '../models/Module';

export const modulesTable = 'modules';

export class ModulesService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(modulesTable)
      .select('*')
      .orderBy('begin', 'asc');
  }

  public getSingle(id: number) {
    return this.db(modulesTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public create(data: ModuleCreationInfo) {
    return this.db(modulesTable)
      .insert({
        semester: data.semester,
        begin: data.begin,
        end: data.end,
        isActive: data.isActive
      })
      .returning('id');
  }

  public update(data: ModuleEditionInfo) {
    return this.db(modulesTable)
      .update({
        begin: data.begin,
        end: data.end,
        isActive: data.isActive
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(modulesTable)
      .where('id', id)
      .delete();
  }
}
