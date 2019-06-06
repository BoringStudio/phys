import knex from 'knex';
import { Connection } from '../connection';
import {
  StudentInfoCreationInfo,
  StudentInfoEditionInfo
} from '../models/StudentInfo';
import { studentEntriesTable, lessonsTable } from './lessons.service';

export const studentInfosTable = 'student_infos';

export class StudentInfosService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(studentInfosTable)
      .select('*')
      .orderBy('id');
  }

  public getSingle(id: number) {
    return this.db(studentInfosTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public getStudentInfo(studentId: number, semesterId: number) {
    return this.db(studentInfosTable)
      .select('*')
      .where({
        student: studentId,
        semester: semesterId
      })
      .first();
  }

  public getLessonInfos(lessonId: number) {
    const db = this.db;

    return this.db(studentInfosTable)
      .distinct()
      .select(`${studentInfosTable}.*`)
      .join(`${lessonsTable}`, function() {
        this.on(`${lessonsTable}.semester`, `${studentInfosTable}.semester`);
      })
      .join(`${studentEntriesTable}`, function() {
        this.on(
          `${studentEntriesTable}.student`,
          `${studentInfosTable}.student`
        ).andOn(`${studentEntriesTable}.lesson`, db.raw('?', [lessonId]));
      });
  }

  public create(data: StudentInfoCreationInfo) {
    return this.db(studentInfosTable)
      .insert({
        student: data.student,
        semester: data.semester,
        healthGroup: data.healthGroup,
        receiptDate: data.receiptDate,
        diary: data.diary,
        competitions: data.competitions,
        personalQualities: data.personalQualities,
        examDate: data.examDate
      })
      .returning('id');
  }

  public update(data: StudentInfoEditionInfo) {
    return this.db(studentInfosTable)
      .update({
        healthGroup: data.healthGroup,
        receiptDate: data.receiptDate,
        diary: data.diary,
        competitions: data.competitions,
        personalQualities: data.personalQualities,
        examDate: data.examDate
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(studentInfosTable)
      .where('id', id)
      .delete();
  }
}
