import knex from 'knex';
import { Connection } from '../connection';
import { Group, GroupCreationInfo, GroupEditionInfo } from '../models/Group';

export class GroupsService {
  private connector: knex;

  constructor() {
    this.connector = new Connection().knex();
  }

  public getAllGroups() {
    return this.connector('groups').select('*');
  }

  public getSingleGroup(id: number) {
    return this.connector('groups')
      .select('*')
      .where({
        id
      })
      .first();
  }

  public createGroup(data: GroupCreationInfo) {
    return this.connector('groups')
      .insert({
        name: data.name
      })
      .returning('id');
  }

  public updateGroup(data: GroupEditionInfo) {
    return this.connector('groups')
      .update({
        name: data.name
      })
      .where('id', data.id);
  }

  public removeGroup(id: number) {
    return this.connector('groups')
      .where('id', id)
      .delete();
  }
}
