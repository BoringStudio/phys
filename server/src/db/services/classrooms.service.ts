import knex from 'knex';
import { Connection } from '../connection';
import {
  ClassroomCreationInfo,
  ClassroomEditionInfo
} from '../models/Classroom';

const classroomsTable = 'classrooms';

export class ClassroomsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(classroomsTable)
      .select('*')
      .orderBy('id');
  }

  public getSingle(id: number) {
    return this.db(classroomsTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public create(data: ClassroomCreationInfo) {
    return this.db(classroomsTable)
      .insert({
        name: data.name
      })
      .returning('id');
  }

  public update(data: ClassroomEditionInfo) {
    return this.db(classroomsTable)
      .update({
        name: data.name
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(classroomsTable)
      .where('id', id)
      .delete();
  }
}
