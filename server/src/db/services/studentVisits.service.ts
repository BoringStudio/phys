import knex from 'knex';
import { Connection } from '../connection';
import {
  StudentVisitCreationInfo,
  StudentVisitEditionInfo
} from '../models/StudentVisit';
import { studentEntriesTable, lessonsTable } from './lessons.service';
import { semestersTable } from './semesters.service';

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

  public getLesson(id: number) {
    const db = this.db;

    return this.db(lessonsTable)
      .select(`${lessonsTable}.*`)
      .join(studentVisitsTable, function() {
        this.on(`${studentVisitsTable}.id`, db.raw('?', [id]));
      })
      .join(studentEntriesTable, function() {
        this.on(
          `${studentEntriesTable}.id`,
          `${studentVisitsTable}.entry`
        ).andOn(`${studentEntriesTable}.lesson`, `${lessonsTable}.id`);
      })
      .first();
  }

  public getSemester(id: number) {
    const db = this.db;

    return this.db(semestersTable)
      .select(`${semestersTable}.*`)
      .join(studentVisitsTable, function() {
        this.on(`${studentVisitsTable}.id`, db.raw('?', [id]));
      })
      .join(studentEntriesTable, function() {
        this.on(`${studentEntriesTable}.id`, `${studentVisitsTable}.entry`);
      })
      .join(lessonsTable, function() {
        this.on(`${lessonsTable}.id`, `${studentEntriesTable}.lesson`).andOn(
          `${lessonsTable}.semester`,
          `${semestersTable}.id`
        );
      })
      .first();
  }

  public getEntry(id: number) {
    const db = this.db;
    return this.db(studentEntriesTable)
      .select(`${studentEntriesTable}.*`)
      .join(studentVisitsTable, function() {
        this.on(
          `${studentVisitsTable}.entry`,
          `${studentEntriesTable}.id`
        ).andOn(`${studentVisitsTable}.id`, db.raw('?', [id]));
      })
      .first();
  }

  public getLessonVisits(lessonId: number) {
    const db = this.db;

    return this.db(studentVisitsTable)
      .distinct()
      .select(
        `${studentVisitsTable}.id`,
        `${studentVisitsTable}.mark`,
        `${studentVisitsTable}.week`,
        `${studentEntriesTable}.lesson as lesson`,
        `${studentEntriesTable}.student as student`
      )
      .join(studentEntriesTable, function() {
        this.on(`${studentEntriesTable}.lesson`, db.raw('?', [lessonId])).andOn(
          `${studentVisitsTable}.entry`,
          `${studentEntriesTable}.id`
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
        `${studentEntriesTable}.lesson as lesson`,
        `${studentEntriesTable}.student as student`
      )
      .join(studentEntriesTable, function() {
        this.on(`${studentEntriesTable}.lesson`, db.raw('?', [lessonId]))
          .andOn(`${studentEntriesTable}.student`, db.raw('?', [studentId]))
          .andOn(`${studentVisitsTable}.entry`, `${studentEntriesTable}.id`);
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
