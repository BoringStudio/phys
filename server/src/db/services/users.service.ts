import knex from 'knex';
import { Connection } from '../connection';
import { UserCreationInfo } from '../models/User';

export class UsersService {
  private connector: knex;

  constructor() {
    this.connector = new Connection().knex();
  }

  public getAllUsers() {
    return this.connector.table('users').select('*');
  }

  public getSingleUser(id: number) {
    return this.connector
      .table('users')
      .select('*')
      .where({
        id
      })
      .first();
  }

  public findByAuthData(login: string, password: string) {
    return this.connector
      .table('users')
      .select('*')
      .where('users.login', login)
      .andWhereRaw('users.password = crypt(?, users.password)', [password])
      .first();
  }

  public createUser(data: UserCreationInfo) {
    return this.connector
      .table('users')
      .insert({
        login: data.login,
        password: this.connector.raw("crypt(?, gen_salt('bf'))", [
          data.password
        ]),
        surname: data.surname,
        name: data.name,
        middlename: data.middlename
      })
      .returning('id');
  }
}
