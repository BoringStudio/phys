import knex from 'knex';
import { Connection } from '../connection';
import { TestCreationInfo, TestEditionInfo } from '../models/Test';

const testsTable = 'tests';

export class TestsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(testsTable).select('*');
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
    console.log(data);

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
    console.log(
      `ARRAY[${Array.from(Array(array.length), () => '?::numeric').join(',')}]`
    );

    return this.db.raw(
      `ARRAY[${Array.from(Array(array.length), () => '?::numeric').join(',')}]`,
      array
    );
  }
}
