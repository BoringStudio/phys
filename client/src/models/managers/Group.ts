import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export interface IGroupData {
  id: number;
  name: string;
}

export class Group implements IGroupData {
  public id: number = -1;
  public name: string = '';

  constructor(data?: IGroupData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
  }
}

export type GroupEvent =
  | 'groups_total_changed'
  | 'group_created'
  | 'group_updated'
  | 'group_removed';

export class GroupManager {
  public total: number = 0;

  public async fetchTotalCount() {
    const res = await axios.get<number>(`groups/total`);
    this.total = res.data;

    bus.fire('groups_total_changed', this.total);
    return this.total;
  }

  public async fetchPage(perPage: number, page: number) {
    const res = await axios.get<IGroupData[]>(
      `groups?perPage=${perPage}&page=${page}`
    );

    return res.data.map((data) => new Group(data));
  }

  public async search(value: string, limit: number = 10) {
    const res = await axios.get<IGroupData[]>(
      `groups/search?match=${encodeURIComponent(value)}&limit=${limit}`
    );

    return res.data.map((data) => new Group(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IGroupData>(`group/${id}`);
    return new Group(res.data);
  }

  public async create(data: Omit<IGroupData, 'id'>) {
    const res = await axios.post<number>('group', data);

    const group = new Group({
      ...data,
      id: res.data
    });
    bus.fire('group_created', group);
    return group;
  }

  public async update(data: IGroupData) {
    await axios.put('group', data);
    const group = new Group(data);

    bus.fire('group_updated', group);
    return group;
  }

  public async remove(id: number) {
    await axios.delete(`group/${id}`);
    bus.fire('group_removed', id);
  }
}
