import { LessonInstance } from './Lesson';

export class State {
  public currentInstance: LessonInstance = new LessonInstance();
}

const state = new State();
export default state;
