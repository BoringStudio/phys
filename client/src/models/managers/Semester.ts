import axios from 'axios';
import bus from '../Bus';
import { Omit } from '../Stuff';

import moment from 'moment-timezone';

export interface ISemesterData {
  id: number;
  begin: Date;
  end: Date;
}

export class Semester implements ISemesterData {
  public id: number = -1;
  public begin: Date = new Date();
  public end: Date = new Date();

  constructor(data?: ISemesterData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.begin = data.begin;
    this.end = data.end;
  }

  public get rangeName() {
    const format = 'DD.MM.YYYY';
    const begin = moment(this.begin).format(format);
    const end = moment(this.end).format(format);
    return `${begin} - ${end}`;
  }
}

export type SemesterEvent =
  | 'semester_created'
  | 'semester_updated'
  | 'semester_removed';

export class SemesterManager {
  public async fetchAll() {
    const res = await axios.get<ISemesterData[]>('semesters');
    return res.data.map((data) => new Semester(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<ISemesterData>(`semester/${id}`);
    return new Semester(res.data);
  }

  public async create(data: Omit<ISemesterData, 'id'>) {
    const res = await axios.post<number>('semester', data);

    const semester = new Semester({
      ...data,
      id: res.data
    });
    bus.fire('semester_created', semester);
    return semester;
  }

  public async update(data: ISemesterData) {
    await axios.put('semester', data);
    const semester = new Semester(data);

    bus.fire('semester_updated', semester);
    return semester;
  }

  public async remove(id: number) {
    await axios.delete(`semester/${id}`);
    bus.fire('semester_removed', id);
  }
}
