import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export type Gender = 'male' | 'female';

export interface IStudentData {
  id: number;
  surname: string;
  name: string;
  middlename: string | null;
  gender: Gender;
  group: number;
}

export class Student implements IStudentData {
  public id: number = -1;
  public surname: string = '';
  public name: string = '';
  public middlename: string | null = null;
  public gender: Gender = 'male';
  public group: number = -1;

  constructor(data?: IStudentData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.surname = data.surname;
    this.name = data.name;
    this.middlename = data.middlename;
    this.gender = data.gender;
    this.group = data.group;
  }

  public get fullName() {
    return (
      `${this.surname} ${this.name}` +
      (this.middlename ? ` ${this.middlename}` : '')
    );
  }
}

export type StudentEvent =
  | 'student_created'
  | 'student_updated'
  | 'student_removed';

export class StudentManager {
  public async fetchAll() {
    const res = await axios.get<IStudentData[]>('students');
    return res.data.map((data) => new Student(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IStudentData>(`student/${id}`);
    return new Student(res.data);
  }

  public async create(data: Omit<IStudentData, 'id'>) {
    const res = await axios.post<number>('student', data);

    const student = new Student({
      ...data,
      id: res.data
    });
    bus.fire('student_created', student);
    return student;
  }

  public async update(data: IStudentData) {
    await axios.put('student', data);
    const student = new Student(data);

    bus.fire('student_updated', student);
    return student;
  }

  public async remove(id: number) {
    await axios.delete(`student/${id}`);
    bus.fire('student_removed', id);
  }
}
