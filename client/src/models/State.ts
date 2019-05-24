import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

import { UserManager } from './managers/User';
import { ClassroomManager } from './managers/Classroom';
import { TestManager } from './managers/Test';
import { StudentManager } from './managers/Student';
import { GroupManager } from './managers/Group';

export class State {
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
