import knex from 'knex';
import { Connection } from '../connection';
import { StudentCreationInfo, StudentEditionInfo } from '../models/Student';

const studentsTable = 'students';

export class StudentsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(studentsTable)
      .select('*')
      .orderBy('id');
  }

  public getPage(perPage: number, page: number) {
    return this.db(studentsTable)
      .select('*')
      .orderBy('id')
      .offset((page - 1) * perPage)
      .limit(perPage);
  }

  public getTotalCount() {
    return this.db(studentsTable)
      .count('* as count')
      .first();
  }

  public search(match: string, limit: number) {
    let words = match.split(' ');
    let pattern = 'LOWER(?), '.repeat(words.length);
    pattern = `(array[${pattern.substring(0, pattern.length - 2)}])`;
    words = words.map((word) => `%${word}%`);

    return this.db(studentsTable)
      .select('*')
      .whereRaw(`LOWER(surname) LIKE ANY ${pattern}`, words)
      .orWhereRaw(`LOWER(name) LIKE ANY ${pattern}`, words)
      .orWhereRaw(`LOWER(middlename) LIKE ANY ${pattern}`, words)
      .orderBy('id')
      .limit(limit);
  }

  public getSingle(id: number) {
    return this.db(studentsTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public create(data: StudentCreationInfo) {
    return this.db(studentsTable)
      .insert({
        surname: data.surname,
        name: data.name,
        middlename: data.middlename,
        gender: data.gender,
        group: data.group
      })
      .returning('id');
  }

  public update(data: StudentEditionInfo) {
    return this.db(studentsTable)
      .update({
        surname: data.surname,
        name: data.name,
        middlename: data.middlename,
        gender: data.gender,
        group: data.group
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(studentsTable)
      .where('id', id)
      .delete();
  }
}
