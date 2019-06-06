import knex from 'knex';
import { Connection } from '../connection';
import { ParameterType, ParameterValueType } from '../models/Parameter';

export const parametersTable = 'parameters';

export class ParametersService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public get(parameter: ParameterType) {
    return this.db(parametersTable)
      .select('*')
      .where('parameter', parameter)
      .first();
  }

  public set(parameter: ParameterType, value: ParameterValueType) {
    const insertedValue = this.db.raw('?::varchar', [value]);

    return this.db.raw('? ON CONFLICT (parameter) DO UPDATE SET value=?', [
      this.db(parametersTable).insert({
        parameter,
        value: insertedValue
      }),
      insertedValue
    ]);
  }
}
