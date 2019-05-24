export class Day {
  public name: string;
  public lessons: Lesson[];

  constructor(name: string) {
    this.name = name;
    this.lessons = Array.apply(null, Array(5)).map(() => new Lesson(this));
  }
}

export class LessonInstance {
  public lesson: Lesson | null;
  public place: string;
  public type: string;

  constructor(lesson?: Lesson, place?: string, type?: string) {
    this.lesson = lesson || null;
    this.place = place || '';
    this.type = type || '';
  }
}

export class Lesson {
  public day: Day | null;

  public instances: LessonInstance[];

  constructor(day?: Day, instances?: LessonInstance[]) {
    this.day = day || null;
    this.instances = instances || [];
  }

  public get isEmpty() {
    return this.instances.length === 0;
  }

  public get index() {
    if (this.day == null) {
      return -1;
    }

    return this.day.lessons.findIndex((l) => l === this);
  }

  public get name() {
    const index = this.index;

    if (index < 0) {
      return '';
    }

    return [
      'I - (9:00-10:30)',
      'II - (10:40-12:10)',
      'III - (13:00-14:30)',
      'IV - (14:40-16:10)',
      'V - (16:20-17:50)'
    ][index];
  }
}
