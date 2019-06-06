import knex from 'knex';
import { Connection } from '../connection';
import { SemesterCreationInfo, SemesterEditionInfo } from '../models/Semester';

import { modulesTable } from './modules.service';

const semestersTable = 'semesters';

export class SemestersService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(semestersTable)
      .select('*')
      .orderBy('begin', 'desc');
  }

  public getSingle(id: number) {
    return this.db(semestersTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public getModules(id: number) {
    return this.db(modulesTable)
      .select('*')
      .where('semester', id)
      .orderBy('begin', 'asc');
  }

  public create(data: SemesterCreationInfo) {
    return this.db(semestersTable)
      .insert({
        begin: data.begin,
        end: data.end
      })
      .returning('id');
  }

  public update(data: SemesterEditionInfo) {
    return this.db(semestersTable)
      .update({
        begin: data.begin,
        end: data.end
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(semestersTable)
      .where('id', id)
      .delete();
  }
}
