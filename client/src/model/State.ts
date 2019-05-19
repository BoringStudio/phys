import { UserManager } from './User';

import { LessonInstance } from './Lesson';
import { ClassroomManager } from './Classroom';

import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export class State {
  public currentInstance: LessonInstance = new LessonInstance();

  public userManager: UserManager;
  public classroomManager: ClassroomManager;

  constructor() {
    this.userManager = new UserManager();
    this.classroomManager = new ClassroomManager();
  }
}

const state = new State();
export default state;
