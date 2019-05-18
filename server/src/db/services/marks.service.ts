import knex from 'knex';
import { Connection } from '../connection';
import { MarkCreationInfo, MarkEditionInfo } from '../models/Mark';

const marksTable = 'marks';

export class MarksService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(marksTable).select('*');
  }

  public getSingle(id: number) {
    return this.db(marksTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public create(data: MarkCreationInfo) {
    return this.db(marksTable)
      .insert({
        name: data.name,
        symbol: data.symbol,
        weight: data.weight
      })
      .returning('id');
  }

  public update(data: MarkEditionInfo) {
    return this.db(marksTable)
      .update({
        name: data.name,
        symbol: data.symbol,
        weight: data.weight
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(marksTable)
      .where('id', id)
      .delete();
  }
}
