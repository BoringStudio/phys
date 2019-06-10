import knex from 'knex';
import { Connection } from '../connection';
import { UserCreationInfo, UserEditionInfo } from '../models/User';

const usersTable = 'users';

export class UsersService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(usersTable)
      .select('*')
      .orderBy('id');
  }

  public search(match: string, limit: number) {
    let query = this.db(usersTable).select('*');

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

    query = query.orderBy(`${usersTable}.id`).limit(limit);

    return query;
  }

  public getSingle(id: number) {
    return this.db(usersTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public findByAuthData(login: string, password: string) {
    return this.db(usersTable)
      .select('*')
      .where('login', login)
      .andWhereRaw('password = crypt(?, password)', [password])
      .first();
  }

  public create(data: UserCreationInfo) {
    return this.db(usersTable)
      .insert({
        login: data.login,
        password: this.db.raw(`crypt(?, gen_salt('bf'))`, [data.password]),
        surname: data.surname,
        name: data.name,
        middlename: data.middlename
      })
      .returning('id');
  }

  public update(data: UserEditionInfo) {
    return this.db(usersTable).update({
      login: data.login,
      password: data.password
        ? this.db.raw(`crypt(?, gen_salt('bf'))`, [data.password])
        : undefined,
      surname: data.surname,
      name: data.name,
      middlename: data.middlename
    });
  }

  public remove(id: number) {
    return this.db(usersTable)
      .where('id', id)
      .delete();
  }
}
