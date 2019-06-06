import knex from 'knex';
import _ from 'underscore';

import { Connection } from '../connection';
import {
  DisciplineCreationInfo,
  DisciplineEditionInfo
} from '../models/Discipline';

const disciplinesTable = 'disciplines';
const disciplineTestsTable = 'discipline_tests';

export class DisciplinesService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(disciplinesTable)
      .select('*')
      .orderBy('id');
  }

  public getSingle(id: number) {
    return this.db(disciplinesTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public search(match: string, limit: number) {
    return this.db(disciplinesTable)
      .select('*')
      .whereRaw('LOWER(name) LIKE LOWER(?)', [`%${match}%`])
      .orderBy('id')
      .limit(limit);
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
      .select('test')
      .where('discipline', id)
      .orderBy('test');
  }

  public addTest(disciplineId: number, testId: number) {
    return this.db(disciplineTestsTable).insert({
      discipline: disciplineId,
      test: testId
    });
  }

  public async updateTests(disciplineId: number, testIds: number[]) {
    const existing = (await this.db(disciplineTestsTable)
      .where('discipline', disciplineId)
      .select('test')).map((v: { test: number }) => v.test);

    const toDelete = _.difference(existing, testIds);
    const toInsert = _.difference(testIds, existing);

    await Promise.all([
      this.db(disciplineTestsTable)
        .whereIn('test', toDelete)
        .andWhere('discipline', disciplineId)
        .delete(),
      this.db(disciplineTestsTable).insert(
        toInsert.map((id) => ({
          test: id,
          discipline: disciplineId
        }))
      )
    ]);
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
