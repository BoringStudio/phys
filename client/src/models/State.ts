import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

import { UserManager } from './managers/User';
import { ClassroomManager } from './managers/Classroom';
import { TestManager } from './managers/Test';
import { StudentManager } from './managers/Student';
import { GroupManager } from './managers/Group';
import { DisciplineManager } from './managers/Discipline';

export class State {
  public userManager: UserManager = new UserManager();
  public classroomManager: ClassroomManager = new ClassroomManager();
  public testManager: TestManager = new TestManager();
  public groupManager: GroupManager = new GroupManager();
  public studentManager: StudentManager = new StudentManager();
  public disciplineManager: DisciplineManager = new DisciplineManager();
}

const state = new State();
export default state;
