import { UserManager } from './User';

import { LessonInstance } from './Lesson';

export class State {
  public currentInstance: LessonInstance = new LessonInstance();

  public userManager: UserManager;

  constructor() {
    this.userManager = new UserManager();
  }
}

const state = new State();
export default state;
