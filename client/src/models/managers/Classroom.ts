import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export interface IClassroomData {
  id: number;
  name: string;
}

export class Classroom implements IClassroomData {
  public id: number = -1;
  public name: string = '';

  constructor(data?: IClassroomData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
  }
}

export type ClassroomEvent =
  | 'classroom_created'
  | 'classroom_updated'
  | 'classroom_removed';

export class ClassroomManager {
  public async fetchAll() {
    const res = await axios.get<IClassroomData[]>('classrooms');
    return res.data.map((data) => new Classroom(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IClassroomData>(`classroom/${id}`);
    return new Classroom(res.data);
  }

  public async create(data: Omit<IClassroomData, 'id'>) {
    const res = await axios.post<number>('classroom', data);

    const classroom = new Classroom({
      ...data,
      id: res.data
    });
    bus.fire('classroom_created', classroom);
    return classroom;
  }

  public async update(data: IClassroomData) {
    await axios.put('classroom', data);
    const classroom = new Classroom(data);

    bus.fire('classroom_updated', classroom);
    return classroom;
  }

  public async remove(id: number) {
    await axios.delete(`classroom/${id}`);
    bus.fire('classroom_removed', id);
  }
}
