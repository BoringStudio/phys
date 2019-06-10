import knex from 'knex';
import { Connection } from '../connection';
import { LessonCreationInfo, LessonEditionInfo } from '../models/Lesson';
import { studentsTable } from './students.service';
import { groupsTable } from './groups.service';
import { disciplineTestsTable } from './disciplines.service';
import { testsTable } from './tests.service';

export const lessonsTable = 'lessons';
export const studentEntriesTable = 'student_entries';

export class LessonsService {
  private db: knex;

  constructor() {
    this.db = new Connection().knex();
  }

  public getAll() {
    return this.db(lessonsTable)
      .select('*')
      .orderBy('id');
  }

  public getSemesterLessons(id: number) {
    return this.db(lessonsTable)
      .select('*')
      .where('semester', id)
      .orderBy('id');
  }

  public getSingle(id: number) {
    return this.db(lessonsTable)
      .select('*')
      .where({
        id
      })
      .first();
  }

  public getStudents(id: number) {
    const db = this.db;

    return this.db(studentsTable)
      .select(`${studentsTable}.*`, `${studentEntriesTable}.id as entryId`)
      .join(studentEntriesTable, function() {
        this.on(`${studentsTable}.id`, `${studentEntriesTable}.student`).andOn(
          `${studentEntriesTable}.lesson`,
          db.raw('?', [id])
        );
      })
      .groupBy(`${studentsTable}.id`, 'entryId')
      .orderBy('entryId');
  }

  public getGroups(id: number) {
    const db = this.db;

    return this.db(groupsTable)
      .distinct()
      .select(`${groupsTable}.*`)
      .join(studentsTable, function() {
        this.on(`${groupsTable}.id`, `${studentsTable}.group`);
      })
      .join(studentEntriesTable, function() {
        this.on(`${studentsTable}.id`, `${studentEntriesTable}.student`).andOn(
          `${studentEntriesTable}.lesson`,
          db.raw('?', [id])
        );
      });
  }

  public getTests(id: number) {
    const db = this.db;

    return this.db(testsTable)
      .distinct()
      .select(`${testsTable}.*`)
      .join(`${lessonsTable}`, function() {
        this.on(`${lessonsTable}.id`, db.raw('?', [id]));
      })
      .join(`${disciplineTestsTable}`, function() {
        this.on(
          `${disciplineTestsTable}.discipline`,
          `${lessonsTable}.discipline`
        ).andOn(`${disciplineTestsTable}.test`, `${testsTable}.id`);
      })
      .orderBy(`${testsTable}.id`);
  }

  public create(data: LessonCreationInfo) {
    return this.db(lessonsTable)
      .insert({
        semester: data.semester,
        teacher: data.teacher,
        discipline: data.discipline,
        classroom: data.classroom,
        day: data.day,
        number: data.number
      })
      .returning('id');
  }

  public update(data: LessonEditionInfo) {
    return this.db(lessonsTable)
      .update({
        semester: data.semester,
        teacher: data.teacher,
        discipline: data.discipline,
        classroom: data.classroom,
        day: data.day,
        number: data.number
      })
      .where('id', data.id);
  }

  public remove(id: number) {
    return this.db(lessonsTable)
      .where('id', id)
      .delete();
  }

  public getEntry(lessonId: number, studentId: number) {
    return this.db(studentEntriesTable)
      .select('id')
      .where({
        lesson: lessonId,
        student: studentId
      })
      .first();
  }

  public addStudent(lessonId: number, studentId: number) {
    return this.db(studentEntriesTable)
      .insert({
        lesson: lessonId,
        student: studentId
      })
      .returning('id');
  }

  public removeStudent(lessonId: number, studentId: number) {
    return this.db(studentEntriesTable)
      .where('lesson', lessonId)
      .andWhere('student', studentId)
      .delete();
  }
}
