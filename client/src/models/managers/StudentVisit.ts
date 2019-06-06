import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export interface IStudentVisitData {
  id: number;
  mark: number;
  week: number;
  lesson: number;
  student: number;
}

export class StudentVisit implements IStudentVisitData {
  public id: number = -1;
  public mark: number = -1;
  public week: number = 0;
  public lesson: number = -1;
  public student: number = -1;

  constructor(data?: IStudentVisitData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.mark = data.mark;
    this.week = data.week;
    this.lesson = data.lesson;
    this.student = data.student;
  }
}

export type StudentVisitEvent =
  | 'student_visit_created'
  | 'student_visit_updated'
  | 'student_visit_removed';

export class StudentVisitManager {
  public async fetchStudentLessonVisits(lessonId: number, studentId: number) {
    const res = await axios.get<IStudentVisitData[]>(
      `student_visits/lesson/${lessonId}/student/${studentId}`
    );
    return res.data.map((data) => new StudentVisit(data));
  }

  public async create(data: Omit<IStudentVisitData, 'id'>) {
    const res = await axios.post<number>('student_visit', data);

    const studentVisit = new StudentVisit({
      ...data,
      id: res.data
    });
    bus.fire('student_visit_created', studentVisit);
    return studentVisit;
  }

  public async update(data: IStudentVisitData) {
    await axios.put('student_visit', { id: data.id, mark: data.mark });
    const studentVisit = new StudentVisit(data);

    bus.fire('student_visit_updated', studentVisit);
    return studentVisit;
  }

  public async remove(id: number) {
    await axios.delete(`student_visit/${id}`);
    bus.fire('student_visit_removed', id);
  }
}
