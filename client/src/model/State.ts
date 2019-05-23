import { UserManager } from './User';

import { LessonInstance } from './Lesson';
import { ClassroomManager } from './Classroom';
import { TestManager } from './Test';
import { StudentManager } from './Student';
import { GroupManager } from './Group';

import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export class State {
  public currentInstance: LessonInstance = new LessonInstance();

  public userManager: UserManager;
  public classroomManager: ClassroomManager;
  public testManager: TestManager;
  public groupManager: GroupManager;
  public studentManager: StudentManager;

  constructor() {
    this.userManager = new UserManager();
    this.classroomManager = new ClassroomManager();
    this.testManager = new TestManager();
    this.groupManager = new GroupManager();
    this.studentManager = new StudentManager();
  }
}

const state = new State();
export default state;
