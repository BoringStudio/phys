import knex from 'knex';
import { Connection } from '../connection';
import {
  StudentVisitCreationInfo,
  StudentVisitEditionInfo
} from '../models/StudentVisit';

const studentVisitsTable = 'student_visits';

export class StudentVisitsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(studentVisitsTable)
      .select('*')
      .orderBy('date', 'asc');
  }

  public getSingle(id: number) {
    return this.db(studentVisitsTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public getLessonVisits(lessonId: number) {
    return this.db(studentVisitsTable)
      .select('*')
      .where('lesson', lessonId)
      .orderBy('date', 'asc');
  }

  public getStudentVisits(studentId: number, lessonId: number) {
    return this.db(studentVisitsTable)
      .select('*')
      .where({
        student: studentId,
        lesson: lessonId
      })
      .orderBy('date', 'asc');
  }

  public create(data: StudentVisitCreationInfo) {
    return this.db(studentVisitsTable)
      .insert({
        date: data.date,
        student: data.student,
        mark: data.mark,
        lesson: data.lesson
      })
      .returning('id');
  }
}
