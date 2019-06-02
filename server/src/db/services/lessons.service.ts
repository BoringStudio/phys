import knex from 'knex';
import { Connection } from '../connection';
import { LessonCreationInfo, LessonEditionInfo } from '../models/Lesson';

const lessonsTable = 'lessons';

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
}
