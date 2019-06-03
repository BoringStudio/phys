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
    let query = this.db(studentsTable).select(`*`);

    match.split(' ').forEach((word, i) => {
      const action =
        i === 0
          ? (cb: knex.QueryCallback) => query.where(cb)
          : (cb: knex.QueryCallback) => query.andWhere(cb);

      query = action(function() {
        this.whereRaw('LOWER(surname) LIKE LOWER(?)', [`%${word}%`])
          .orWhereRaw('LOWER(name) LIKE LOWER(?)', [`%${word}%`])
          .orWhereRaw('LOWER(middlename) LIKE LOWER(?)', [`%${word}%`]);
      });
    });

    query = query.orderBy(`${studentsTable}.id`).limit(limit);

    console.log(query.toString());

    return query;
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
