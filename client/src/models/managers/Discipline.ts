import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';
import { ITestData, Test } from './Test';

export interface IDisciplineData {
  id: number;
  name: string;
}

export class Discipline implements IDisciplineData {
  public id: number = -1;
  public name: string = '';

  constructor(data?: IDisciplineData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
  }
}

export type DisciplineEvent =
  | 'discipline_created'
  | 'discipline_updated'
  | 'discipline_removed'
  | 'discipline_tests_updated';

export class DisciplineManager {
  public async fetchAll() {
    const res = await axios.get<IDisciplineData[]>('disciplines');

    return res.data.map((data) => new Discipline(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IDisciplineData>(`discipline/${id}`);
    return new Discipline(res.data);
  }

  public async fetchTests(id: number) {
    const res = await axios.get<number[]>(`discipline/${id}/tests`);
    return res.data;
  }

  public async updateTests(id: number, testIds: number[]) {
    await axios.put(`discipline/${id}/tests`, { testIds });
    bus.fire('discipline_tests_updated', { id, testIds });
  }

  public async create(data: Omit<IDisciplineData, 'id'>) {
    const res = await axios.post<number>('discipline', data);

    const discipline = new Discipline({
      ...data,
      id: res.data
    });
    bus.fire('discipline_created', discipline);
    return discipline;
  }

  public async update(data: IDisciplineData) {
    await axios.put('discipline', data);
    const discipline = new Discipline(data);

    bus.fire('discipline_updated', discipline);
    return discipline;
  }

  public async remove(id: number) {
    await axios.delete(`discipline/${id}`);
    bus.fire('discipline_removed', id);
  }
}
