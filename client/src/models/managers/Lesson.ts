import axios from 'axios';
import bus from '@/models/Bus';
import { Omit, DayNumber, LessonNumber } from '@/models/Stuff';
import { IStudentData, Student } from './Student';
import { IGroupData, Group } from './Group';
import { IClassroomData, Classroom } from './Classroom';
import { IDisciplineData, Discipline } from './Discipline';
import { ISemesterData, Semester } from './Semester';
import { IModuleData, Module } from './Module';
import { IStudentInfoData, StudentInfo } from './StudentInfo';
import { IStudentVisitData, StudentVisit } from './StudentVisit';

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

export interface ILessonFullInfoData {
  lesson: ILessonData;
  classroom: IClassroomData;
  discipline: IDisciplineData;
  semester: ISemesterData;
  modules: IModuleData[];
  students: IStudentData[];
  groups: IGroupData[];
}

export class LessonFullInfo implements ILessonFullInfoData {
  public lesson: Lesson;
  public classroom: Classroom;
  public discipline: Discipline;
  public semester: Semester;
  public modules: Module[];
  public students: Student[];
  public groups: Group[];

  constructor(data?: ILessonFullInfoData) {
    this.lesson = new Lesson(data && data.lesson);
    this.classroom = new Classroom(data && data.classroom);
    this.discipline = new Discipline(data && data.discipline);
    this.semester = new Semester(data && data.semester);
    this.modules = (data && data.modules.map((data) => new Module(data))) || [];
    this.students =
      (data && data.students.map((data) => new Student(data))) || [];
    this.groups = (data && data.groups.map((data) => new Group(data))) || [];
  }
}

export type LessonEvent =
  | 'lesson_created'
  | 'lesson_updated'
  | 'lesson_removed'
  | 'lesson_student_added'
  | 'lesson_student_removed';

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

  public async fetchFullInfo(id: number) {
    const res = await axios.get<ILessonFullInfoData>(`lesson/${id}/full_info`);
    return new LessonFullInfo(res.data);
  }

  public async fetchStudents(id: number) {
    const res = await axios.get<IStudentData[]>(`lesson/${id}/students`);
    return res.data.map((data) => new Student(data));
  }

  public async fetchGroups(id: number) {
    const res = await axios.get<IGroupData[]>(`lesson/${id}/groups`);
    return res.data.map((data) => new Group(data));
  }

  public async fetchVisits(lessonId: number) {
    const res = await axios.get<IStudentVisitData[]>(
      `lesson/${lessonId}/student_visits`
    );
    return res.data.map((data) => new StudentVisit(data));
  }

  public async fetchInfos(lessonId: number) {
    const res = await axios.get<IStudentInfoData[]>(
      `lesson/${lessonId}/student_infos`
    );
    return res.data.map((data) => new StudentInfo(data));
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

  public async addStudent(lessonId: number, studentId: number) {
    await axios.post(`lesson/${lessonId}/student`, {
      studentId
    });
    bus.fire('lesson_student_added', { lessonId, studentId });
  }

  public async removeStudent(lessonId: number, studentId: number) {
    await axios.delete(`lesson/${lessonId}/student/${studentId}`);
    bus.fire('lesson_student_removed', { lessonId, studentId });
  }
}
