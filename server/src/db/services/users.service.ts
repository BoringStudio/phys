import knex from 'knex';
import { Connection } from '../connection';
import { UserCreationInfo } from '../models/User';

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
        password: this.db.raw("crypt(?, gen_salt('bf'))", [data.password]),
        surname: data.surname,
        name: data.name,
        middlename: data.middlename
      })
      .returning('id');
  }
}
