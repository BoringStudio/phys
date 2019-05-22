import axios from 'axios';
import bus from '@/model/Bus';
import { Omit, insertOrUpdate, deleteByIndex } from './Stuff';

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

export type StudentEvent = 'students_changed';

export class StudentManager {
  public students: Student[] = [];

  constructor() {
    this.fetchAll();
  }

  public async fetchAll() {
    const res = await axios.get<IStudentData[]>('students');
    this.students = res.data.map((data) => new Student(data));
    bus.fire('students_changed');
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IStudentData>(`student/${id}`);
    const student = new Student(res.data);
    insertOrUpdate(this.students, student);
    bus.fire('students_changed');
  }

  public async create(data: Omit<IStudentData, 'id'>) {
    const res = await axios.post<number>('student', data);

    const student = new Student({
      id: res.data,
      ...data
    });

    this.students.push(student);
    bus.fire('students_changed');
  }

  public async update(data: IStudentData) {
    await axios.put('student', data);
    const student = new Student(data);
    insertOrUpdate(this.students, student);
    bus.fire('students_changed');
  }

  public async remove(id: number) {
    await axios.delete(`student/${id}`);
    deleteByIndex(this.students, id);
    bus.fire('students_changed');
  }
}
