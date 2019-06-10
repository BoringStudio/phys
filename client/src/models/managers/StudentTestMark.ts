import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export interface IStudentTestMarkData {
  id: number;
  test: number;
  result: number;
  student: number;
  semester: number;
}

export class StudentTestMark implements IStudentTestMarkData {
  public id: number;
  public test: number;
  public result: number;
  public student: number;
  public semester: number;

  constructor(data?: Partial<IStudentTestMarkData>) {
    this.id = (data && data.id) || -1;
    this.test = (data && data.test) || -1;
    this.result = (data && data.result) || 0;
    this.student = (data && data.student) || -1;
    this.semester = (data && data.semester) || -1;
  }
}

export type StudentTestMarkEvent =
  | 'student_test_mark_created'
  | 'student_test_mark_updated'
  | 'student_test_mark_removed';

export class StudentTestMarkManager {
  public async create(data: Omit<IStudentTestMarkData, 'id'>) {
    const res = await axios.post<number>('student_test_mark', data);

    const studentTestMark = new StudentTestMark({
      ...data,
      id: res.data
    });
    bus.fire('student_test_mark_created', studentTestMark);
    return studentTestMark;
  }

  public async update(data: IStudentTestMarkData) {
    await axios.put('student_test_mark', { id: data.id, result: data.result });

    const studentTestMark = new StudentTestMark(data);
    bus.fire('student_test_mark_updated', studentTestMark);
    return studentTestMark;
  }

  public async remove(id: number) {
    await axios.delete(`student_test_mark/${id}`);
    bus.fire('student_test_mark_removed', id);
  }
}
