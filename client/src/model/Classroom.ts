import axios from 'axios';
import bus from '@/model/Bus';
import { Omit, insertOrUpdate, deleteByIndex } from './Stuff';

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

export type ClassroomEvent = 'classrooms_changed';

export class ClassroomManager {
  public classrooms: Classroom[] = [];

  constructor() {
    this.fetchAll();
  }

  public async fetchAll() {
    const res = await axios.get<IClassroomData[]>('classrooms');
    this.classrooms = res.data.map((data) => new Classroom(data));
    bus.fire('classrooms_changed');
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IClassroomData>(`classroom/${id}`);
    const classroom = new Classroom(res.data);
    insertOrUpdate(this.classrooms, classroom);
    bus.fire('classrooms_changed');
  }

  public async create(data: Omit<IClassroomData, 'id'>) {
    const res = await axios.post<number>('classroom', data);

    const classroom = new Classroom({
      ...data,
      id: res.data
    });

    this.classrooms.push(classroom);
    bus.fire('classrooms_changed');
  }

  public async update(data: IClassroomData) {
    await axios.put('classroom', data);
    const classroom = new Classroom(data);
    insertOrUpdate(this.classrooms, classroom);
    bus.fire('classrooms_changed');
  }

  public async remove(id: number) {
    await axios.delete(`classroom/${id}`);
    deleteByIndex(this.classrooms, id);
    bus.fire('classrooms_changed');
  }
}
