import knex from 'knex';
import { Connection } from '../connection';
import {
  DisciplineCreationInfo,
  DisciplineEditionInfo
} from '../models/Discipline';
import { testsTable } from './tests.service';

const disciplinesTable = 'disciplines';
const disciplineTestsTable = 'discipline_tests';

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

  public getTests(id: number) {
    return this.db(disciplineTestsTable)
      .join(testsTable, (qb) => {
        qb.on(`${disciplineTestsTable}.test`, `${testsTable}.id`).andOn(
          `${disciplineTestsTable}.discipline`,
          this.db.raw('?', [id])
        );
      })
      .select(`${testsTable}.*`);
  }

  public addTest(disciplineId: number, testId: number) {
    return this.db(disciplineTestsTable).insert({
      discipline: disciplineId,
      test: testId
    });
  }

  public removeTest(disciplineId: number, testId: number) {
    return this.db(disciplineTestsTable)
      .where({
        discipline: disciplineId,
        test: testId
      })
      .delete();
  }
}
