import axios from 'axios';
import bus from '@/models/Bus';
import { Omit, DayNumber, LessonNumber } from '@/models/Stuff';

export interface ILessonData {
  id: number;
  day: DayNumber;
  number: LessonNumber;
  classroom: number;
  teacher: number;
  discipline: number;
  semester: number;
}

export class Lesson implements ILessonData {
  public id: number;
  public day: DayNumber;
  public number: LessonNumber;
  public classroom: number;
  public teacher: number;
  public discipline: number;
  public semester: number;

  constructor(data?: Partial<ILessonData>) {
    if (data == null) {
      data = {};
    }

    this.id = data.id || -1;
    this.day = data.day || 0;
    this.number = data.number || 0;
    this.classroom = data.classroom || -1;
    this.teacher = data.teacher || -1;
    this.discipline = data.discipline || -1;
    this.semester = data.semester || -1;
  }
}

export type LessonEvent =
  | 'lesson_created'
  | 'lesson_updated'
  | 'lesson_removed';

export class LessonManager {
  public async fetchAll(onlyCurrentSemester: boolean = true) {
    const res = await axios.get<ILessonData[]>(
      `lessons${onlyCurrentSemester ? '/current_semester' : ''}`
    );
    return res.data.map((data) => new Lesson(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<ILessonData>(`lesson/${id}`);
    return new Lesson(res.data);
  }

  public async create(data: Omit<ILessonData, 'id'>) {
    const res = await axios.post<number>('lesson', data);

    const lesson = new Lesson({
      ...data,
      id: res.data
    });
    bus.fire('lesson_created', lesson);
    return lesson;
  }

  public async update(data: ILessonData) {
    await axios.put('lesson', data);
    const lesson = new Lesson(data);

    bus.fire('lesson_removed', lesson);
    return lesson;
  }

  public async remove(id: number) {
    await axios.delete(`lesson/${id}`);
    bus.fire('lesson_removed', id);
  }
}
