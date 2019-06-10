import knex from 'knex';
import { Connection } from '../connection';
import {
  StudentTestMarkCreationInfo,
  StudentTestMarkEditionInfo
} from '../models/studentTestMark';
import { lessonsTable, studentEntriesTable } from './lessons.service';

const studentTestMarksTable = 'student_test_marks';

export class StudentTestMarksService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(studentTestMarksTable)
      .select('*')
      .orderBy('id');
  }

  public getSingle(id: number) {
    return this.db(studentTestMarksTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public getStudentTestMarks(studentId: number, semesterId: number) {
    return this.db(studentTestMarksTable)
      .select('*')
      .where({
        student: studentId,
        semester: semesterId
      })
      .orderBy('id');
  }

  public getLessonTestMarks(lessonId: number) {
    const db = this.db;

    return this.db(studentTestMarksTable)
      .distinct()
      .select(`${studentTestMarksTable}.*`)
      .join(`${studentEntriesTable}`, function() {
        this.on(
          `${studentEntriesTable}.student`,
          `${studentTestMarksTable}.student`
        ).andOn(`${studentEntriesTable}.lesson`, db.raw('?', [lessonId]));
      });
  }

  public create(data: StudentTestMarkCreationInfo) {
    return this.db(studentTestMarksTable)
      .insert({
        test: data.test,
        result: data.result,
        student: data.student,
        semester: data.semester
      })
      .returning('id');
  }

  public update(data: StudentTestMarkEditionInfo) {
    return this.db(studentTestMarksTable)
      .update({
        result: data.result
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(studentTestMarksTable)
      .where('id', id)
      .delete();
  }
}
