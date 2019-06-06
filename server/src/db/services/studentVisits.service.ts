import knex from 'knex';
import { Connection } from '../connection';
import {
  StudentVisitCreationInfo,
  StudentVisitEditionInfo
} from '../models/StudentVisit';
import { studentEntries } from './lessons.service';

const studentVisitsTable = 'student_visits';

export class StudentVisitsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(studentVisitsTable)
      .select('*')
      .orderBy('week', 'asc');
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
    const db = this.db;

    return this.db(studentVisitsTable)
      .select(
        `${studentVisitsTable}.id`,
        `${studentVisitsTable}.mark`,
        `${studentVisitsTable}.week`,
        `${studentEntries}.lesson as lesson`,
        `${studentEntries}.student as student`
      )
      .join(studentEntries, function() {
        this.on(`${studentEntries}.lesson`, '=', db.raw('?', [lessonId])).andOn(
          `${studentVisitsTable}.entry`,
          '=',
          `${studentEntries}.id`
        );
      })
      .orderBy('week', 'asc');
  }

  public getStudentLessonVisits(lessonId: number, studentId: number) {
    const db = this.db;

    return this.db(studentVisitsTable)
      .select(
        `${studentVisitsTable}.id`,
        `${studentVisitsTable}.mark`,
        `${studentVisitsTable}.week`,
        `${studentEntries}.lesson as lesson`,
        `${studentEntries}.student as student`
      )
      .join(studentEntries, function() {
        this.on(`${studentEntries}.lesson`, '=', db.raw('?', [lessonId]))
          .andOn(`${studentEntries}.student`, '=', db.raw('?', [studentId]))
          .andOn(`${studentVisitsTable}.entry`, '=', `${studentEntries}.id`);
      })
      .orderBy('week', 'asc');
  }

  public create(data: StudentVisitCreationInfo, entry: number) {
    return this.db(studentVisitsTable)
      .insert({
        week: data.week,
        mark: data.mark,
        entry
      })
      .returning('id');
  }

  public update(data: StudentVisitEditionInfo) {
    return this.db(studentVisitsTable)
      .update({
        mark: data.mark
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(studentVisitsTable)
      .where('id', id)
      .delete();
  }
}
