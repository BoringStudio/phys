import knex from 'knex';
import { Connection } from '../connection';
import { TestCreationInfo, TestEditionInfo } from '../models/Test';

export const testsTable = 'tests';

export class TestsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(testsTable)
      .select('*')
      .orderBy('id');
  }

  public getSingle(id: number) {
    return this.db(testsTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public create(data: TestCreationInfo) {
    return this.db(testsTable)
      .insert({
        name: data.name,
        direction: data.direction,
        maleMarks: this.prepareArray(data.maleMarks),
        femaleMarks: this.prepareArray(data.femaleMarks)
      })
      .returning('id');
  }

  public update(data: TestEditionInfo) {
    return this.db(testsTable)
      .update({
        name: data.name,
        direction: data.direction,
        maleMarks: data.maleMarks
          ? this.prepareArray(data.maleMarks)
          : undefined,
        femaleMarks: data.femaleMarks
          ? this.prepareArray(data.femaleMarks)
          : undefined
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(testsTable)
      .where('id', id)
      .delete();
  }

  private prepareArray(array: number[]) {
    return this.db.raw(
      `ARRAY[${Array.from(Array(array.length), () => '?::numeric').join(',')}]`,
      array
    );
  }
}
